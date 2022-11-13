import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Environments } from "../../../../domain/entities/environments"
import { SpreadSheetConnector } from "../../../../infra/gateways/spreadsheets-connector"

export const makeGoogleSpreadsheetConnector = (environments: Environments, http: IHttp): SpreadSheetConnector => {
  return new SpreadSheetConnector(environments, http)
}
