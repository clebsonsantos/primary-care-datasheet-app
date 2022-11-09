import {
  IAppAccessors,
  IConfigurationExtend,
  IConfigurationModify,
  IEnvironmentRead,
  ILogger
} from "@rocket.chat/apps-engine/definition/accessors"
import { App } from "@rocket.chat/apps-engine/definition/App"
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata"
import { Settings } from "./src/main/config/settings"

export class ObCareDataSheetsApp extends App {
  constructor (info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors)
  }

  override async onEnable (environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean> {
    try {
      this.getLogger().log("INITIAL SETTINGS")
      return true
    } catch {
      return false
    }
  }

  protected async extendConfiguration (configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    const settings = new Settings(configuration)
    await settings.createSettings()
  }
}
