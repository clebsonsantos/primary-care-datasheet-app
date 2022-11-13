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
import { AppMethod, IAppInfo } from "@rocket.chat/apps-engine/definition/metadata"
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
import { ILivechatEventContext, IPostLivechatAgentAssigned } from "@rocket.chat/apps-engine/definition/livechat"

export class PrimaryCareDataSheetsApp extends App implements IUIKitInteractionHandler, IPostLivechatAgentAssigned {
  public environments: Environments
  private settingsRead: ISettingRead
  private readonly livechatVisitors: any[]

  constructor (info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors)
    this.livechatVisitors = []
  }

  async [AppMethod.EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED] (context: ILivechatEventContext, read: IRead, http: IHttp, persis: IPersistence, modify?: IModify | undefined): Promise<void> {
    try {
      const room = context.room
      const agent = context.agent

      const date = new Date()

      const data = {
        NAME: room.visitor.name,
        ROOM: room.id,
        "DATE/HOUR": date.toLocaleString("pt-BR"),
        "PHONE VISITOR": room.visitor.phone ?? "uninformed",
        AGENT: agent.name
      }
      this.livechatVisitors.push(data)
      this.getLogger().log("Visitor save in memory", data)
    } catch (error) {
      this.getLogger().log("Error", error)
    }
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
      return viewModalError(modify, context, error.message ?? "An internal server error occurred")
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
      this.loadDefaultsFields()
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

  private async savePatientData (modify: IModify, context: UIKitViewSubmitInteractionContext): Promise<IUIKitResponse> {
    const data = context.getInteractionData()
    if (data.view.state && data.view.id !== ContextualBarEnum.CONTEXTUAL_ID) {
      data.view.state["ID"] = {
        ID: data.view.id
      }
    }

    const controller = makeDataEntryController(this.environments, this.getAccessors().http)
    const result = await controller.handle(data.view.state as object, true)

    if (result instanceof Error) {
      return viewModalWarning(modify, context, result.message)
    }
    return viewModalSuccess(modify, context, "Your record has been saved in the spreadsheet")
  }

  private async fetchDataAndRenderOnView (modify: IModify, context: UIKitViewSubmitInteractionContext, isSelected: any): Promise<IUIKitResponse> {
    const controller = makeChangeDataController(this.environments, this.getAccessors().http)
    const result = await controller.handle()

    if (result instanceof Error) {
      this.getLogger().log(result.message)
      return viewModalSuccess(modify, context, "An error occurred while performing the search")
    }

    const fieldName: string = isSelected.selected.this
    const value: string = isSelected.input.value

    const patientData = generateFilter(result, fieldName.toLowerCase(), value)

    if (!patientData) {
      return viewModalWarning(modify, context, "Registration not found")
    }
    return context.getInteractionResponder().openContextualBarViewResponse(medicalRecordContextualBar(modify, this.environments.fieldsHeader, patientData))
  }
}
