import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Environments } from "../../../../domain/entities/environments"
import { SpreadSheetConnector } from "../../../../infra/gateways/google-spreadsheets"

export const makeGoogleSpreadsheetConnector = (environments: Environments, http: IHttp): SpreadSheetConnector => {
  return new SpreadSheetConnector(environments, http)
}
