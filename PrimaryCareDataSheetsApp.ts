import {
  IAppAccessors,
  IConfigurationModify,
  IEnvironmentRead,
  ILogger
} from '@rocket.chat/apps-engine/definition/accessors'
import { App } from '@rocket.chat/apps-engine/definition/App'
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata'
import { testInitial } from './src/initi'

export class ObCareDataSheetsApp extends App {
  constructor (info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors)
  }

  override async onEnable (environment: IEnvironmentRead, configurationModify: IConfigurationModify): Promise<boolean> {
    try {
      testInitial(this.getLogger())
      this.getLogger().log('INITIAL SETTINGS')
      return true
    } catch {
      return false
    }
  }
}
