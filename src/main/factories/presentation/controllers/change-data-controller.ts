import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Environments } from "../../../../domain/entities/environments"
import { ChangeDataController } from "../../../../presentation/controllers/change-data-controller"
import { makeChangeDataSheetValues } from "../../domain/usecases/change-data-sheet-values"
import { makeGoogleSpreadsheetConnector } from "../../infra/gateways/google-spreadsheet"

export const makeChangeDataController = (environments: Environments, http: IHttp): ChangeDataController => {
  const connector = makeGoogleSpreadsheetConnector(environments, http)
  const service = makeChangeDataSheetValues(connector)
  return new ChangeDataController(service)
}
