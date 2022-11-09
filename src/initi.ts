import { ILogger } from '@rocket.chat/apps-engine/definition/accessors'

export const testInitial = (debug: ILogger): void => {
  debug.log('Hi there.')
}
