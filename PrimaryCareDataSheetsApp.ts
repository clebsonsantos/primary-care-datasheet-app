import {
  IAppAccessors,
  IConfigurationExtend,
  IEnvironmentRead,
  IHttp,
  ILogger,
  IModify,
  IPersistence,
  IRead,
  ISettingRead
} from "@rocket.chat/apps-engine/definition/accessors"
import { App } from "@rocket.chat/apps-engine/definition/App"
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata"
import { IUIKitInteractionHandler, IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"
import { Environments } from "./src/domain/entities/environments"
import { SubmitSlashcommand } from "./src/presentation/commands/submit-slashcommand"
import { Settings } from "./src/main/config/settings"
import { viewModalSuccess } from "./src/ui/components/modal-success"
import { viewModalWarning } from "./src/ui/components/modal-warning"
import { viewModalError } from "./src/ui/components/modal-error"
import { openContextualBar } from "./src/ui/components/contextual-bar"
import { makeDataEntryController } from "./src/main/factories/presentation/controllers/data-entry-controller"

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
    context: UIKitViewSubmitInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<IUIKitResponse> {
    const data = context.getInteractionData()

    try {
      const controller = makeDataEntryController(this.loadDefaultsFields(), this.getAccessors().http)
      const result = await controller.handle(data.view.state as object)

      if (result instanceof Error) {
        return viewModalWarning(modify, context, result.message)
      }

      return viewModalSuccess(modify, context, "Your record has been saved in the spreadsheet")
    } catch (error) {
      return viewModalError(modify, context, error.message ?? "An internal server error occurred")
    }
  }

  protected async extendConfiguration (configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    const settings = new Settings(configuration)
    await settings.createSettings()
    this.settingsRead = environmentRead.getSettings()
    await this.readEnvironmentSettings()
    await configuration.slashCommands.provideSlashCommand(new SubmitSlashcommand(openContextualBar))
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

  private loadDefaultsFields (): Environments {
    const defaultFields = ["NAME", "ROOM", "DATE/HOUR", "PHONE VISITOR", "AGENT"]
    return this.environments.setFieldsHeader(defaultFields.concat(this.environments.fieldsHeader))
  }
}
