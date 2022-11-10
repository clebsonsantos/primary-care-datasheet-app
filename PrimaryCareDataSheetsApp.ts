import {
  IAppAccessors,
  IConfigurationExtend,
  IEnvironmentRead,
  ILogger,
  ISettingRead
} from "@rocket.chat/apps-engine/definition/accessors"
import { App } from "@rocket.chat/apps-engine/definition/App"
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata"
import { Environments } from "./src/domain/entities/environments"
import { Settings } from "./src/main/config/settings"

export class PrimaryCareDataSheetsApp extends App {
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

  protected async extendConfiguration (configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    const settings = new Settings(configuration)
    await settings.createSettings()
    this.settingsRead = environmentRead.getSettings()
    await this.readEnvironmentSettings()
  }

  private async readEnvironmentSettings (): Promise<void> {
    const envSettings = new Environments({
      spreadsheetsId: await this.settingsRead.getValueById("SPREADSHEET_ID"),
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
}
