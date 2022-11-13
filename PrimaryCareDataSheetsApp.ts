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
import { FindByFieldCommand } from "./src/presentation/commands/find-by-field-slashcommand"
import { makeChangeDataController } from "./src/main/factories/presentation/controllers/change-data-controller"
import { generateFilter } from "./src/main/utils/generate-filter"
import { makeDataEntryController } from "./src/main/factories/presentation/controllers/data-entry-controller"
import { ContextualBarEnum } from "./src/ui/enum/contextual-bar"
import { medicalRecordContextualBar } from "./src/ui/components/medical-record-contextual-bar"
import { searchContextualBar } from "./src/ui/components/search-contextual-bar"

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

  public async onSettingUpdated (): Promise<void> {
    await this.loadSettings()
  }

  public async executeViewSubmitHandler (
    context: UIKitViewSubmitInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<IUIKitResponse> {
    const data = context.getInteractionData()
    const itsASearch = data.view.state as any

    try {
      if (itsASearch.selected && itsASearch.input.value) {
        return await this.fetchDataAndRenderOnView(modify, context, itsASearch)
      }

      return await this.savePatientData(modify, context)
    } catch (error) {
      return viewModalError(modify, context, error.message ?? this.environments.i18n?.internal_server_error)
    }
  }

  protected async extendConfiguration (configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    const settings = new Settings(configuration)
    await settings.createSettings()
    this.settingsRead = environmentRead.getSettings()
    await this.readEnvironmentSettings()
    await configuration.slashCommands.provideSlashCommand(new SubmitSlashcommand(medicalRecordContextualBar))
    await configuration.slashCommands.provideSlashCommand(new FindByFieldCommand(searchContextualBar))
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
      await this.loadI18n().catch(() => this.getLogger().log("error loading file i18n"))
      this.loadDefaultsFields()
    }
  }

  private async loadI18n (): Promise<void> {
    const i18n = await this.settingsRead.getValueById("I18N")
    const file = i18n === "en-US" ? require("./src/i18n/en.json") : require("./src/i18n/pt-br.json")
    this.environments.setI18n(file)
  }

  private async loadSettings (): Promise<void> {
    await this.readEnvironmentSettings()
    this.getLogger().log(`SUCCESSFULLY CONFIGURED ENVIRONMENT`)
  }

  private loadDefaultsFields (): Environments {
    const defaultFields = ["DATE/HOUR"]
    return this.environments.setFieldsHeader(defaultFields.concat(this.environments.fieldsHeader))
  }

  private async savePatientData (modify: IModify, context: UIKitViewSubmitInteractionContext): Promise<IUIKitResponse> {
    const i18n = await this.settingsRead.getValueById("I18N").catch(() => "en-US")

    const data = context.getInteractionData()
    if (data.view.state && data.view.id !== ContextualBarEnum.CONTEXTUAL_ID) {
      data.view.state["ID"] = {
        ID: data.view.id
      }
    }
    (data.view as any).state["DATE/HOUR"] = {
      "DATE/HOUR": new Date().toLocaleString(i18n)
    }

    const controller = makeDataEntryController(this.environments, this.getAccessors().http)
    const result = await controller.handle(data.view.state as object, true)

    if (result instanceof Error) {
      return viewModalWarning(modify, context, result.message)
    }
    return viewModalSuccess(modify, context, this.environments.i18n?.record_has_ben_saved_response!)
  }

  private async fetchDataAndRenderOnView (modify: IModify, context: UIKitViewSubmitInteractionContext, isSelected: any): Promise<IUIKitResponse> {
    const controller = makeChangeDataController(this.environments, this.getAccessors().http)
    const result = await controller.handle()

    if (result instanceof Error) {
      this.getLogger().log(result.message)
      return viewModalSuccess(modify, context, this.environments.i18n?.unexpected_error!)
    }

    const fieldName: string = isSelected.selected.this
    const value: string = isSelected.input.value

    const patientData = generateFilter(result, fieldName.toLowerCase(), value)

    if (!patientData) {
      return viewModalWarning(modify, context, this.environments.i18n?.error_register_not_found!)
    }
    return context.getInteractionResponder().openContextualBarViewResponse(medicalRecordContextualBar(modify, this.environments.fieldsHeader, patientData))
  }
}
