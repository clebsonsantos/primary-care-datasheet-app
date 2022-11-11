import {
  IAppAccessors,
  IConfigurationExtend,
  IEnvironmentRead,
  ILogger,
  ISettingRead
} from "@rocket.chat/apps-engine/definition/accessors"
import { App } from "@rocket.chat/apps-engine/definition/App"
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata"
import { IUIKitInteractionHandler, IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"
import { Environments } from "./src/domain/entities/environments"
import { InserDataSheetValues } from "./src/domain/usecases/insert-data-sheet-values"
import { GoogleSpreadSheets } from "./src/infra/gateways/google-spreadsheets"
import { SubmitSlashcommand } from "./src/presentation/controllers/commands/submit-slashcommand"
import { Settings } from "./src/main/config/settings"

export class PrimaryCareDataSheetsApp extends App implements IUIKitInteractionHandler {
  public environments: Environments
  private settingsRead: ISettingRead

  constructor (info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors)
  }

  override async onEnable (): Promise<boolean> {
    try {
      await this.loadSettings()
      return true
    } catch {
      return false
    }
  }

  public async executeViewSubmitHandler (
    context: UIKitViewSubmitInteractionContext
  ): Promise<IUIKitResponse> {
    const data = context.getInteractionData()
    try {
      await this.makeInsertDataSheetValues(data.view.state as object)
      return {
        success: true
      }
    } catch (error) {
      return context.getInteractionResponder().viewErrorResponse({
        viewId: data.view.id,
        errors: error
      })
    }
  }

  protected async extendConfiguration (configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    const settings = new Settings(configuration)
    await settings.createSettings()
    this.settingsRead = environmentRead.getSettings()
    await this.readEnvironmentSettings()
    await configuration.slashCommands.provideSlashCommand(new SubmitSlashcommand())
  }

  private async readEnvironmentSettings (): Promise<void> {
    const envSettings = new Environments({
      spreadsheetsId: await this.settingsRead.getValueById("SPREADSHEET_ID"),
      urlApiConnector: await this.settingsRead.getValueById("SPREADSHEET_CONNECTOR_URL_API"),
      fieldsHeader: await this.settingsRead.getValueById("FIELDS_SPREADSHEET_HEADER").then(value => value.split(",")),
      spreadSheetPageName: await this.settingsRead.getValueById("SPREADSHEET_PAGE_NAME"),
      googleCrendentials: await this.settingsRead.getValueById("GOOGLE_CREDENTIALS").then(value => JSON.parse(value))
    })
    if (envSettings.isValid()) {
      this.environments = envSettings.getValue()
    }
  }

  private async loadSettings (): Promise<void> {
    await this.readEnvironmentSettings()
    this.getLogger().log(`SUCCESSFULLY CONFIGURED ENVIRONMENT`)
  }

  private async makeInsertDataSheetValues (data: object): Promise<void> {
    const body = {}
    for (const [key, value] of Object.entries(data)) {
      body[key] = value[key]
    }

    const spreadsheetConnector = new GoogleSpreadSheets(this.environments, this.getAccessors().http)
    const service = new InserDataSheetValues(spreadsheetConnector)
    const result = await service.perform(body)

    result.isLeft()
      ? this.getLogger().log("Error in InserDataSheetValues", result.value)
      : this.getLogger().log("Your record has been successfully entered", result.value)
  }
}
