import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Environments } from "../../../../domain/entities/environments"
import { GoogleSpreadSheets } from "../../../../infra/gateways/google-spreadsheets"

export const makeGoogleSpreadsheetConnector = (environments: Environments, http: IHttp): GoogleSpreadSheets => {
  return new GoogleSpreadSheets(environments, http)
}
