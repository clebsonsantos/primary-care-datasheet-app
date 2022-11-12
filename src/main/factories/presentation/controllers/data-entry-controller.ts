import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Environments } from "../../../../domain/entities/environments"
import { DataEntryController } from "../../../../presentation/controllers/data-entry-controller"
import { makeInsertDataSheetValues } from "../../domain/usecases/insert-data-sheet-values"
import { makeGoogleSpreadsheetConnector } from "../../infra/gateways/google-spreadsheet"

export const makeDataEntryController = (environments: Environments, http: IHttp): DataEntryController => {
  const connector = makeGoogleSpreadsheetConnector(environments, http)
  const service = makeInsertDataSheetValues(connector)
  return new DataEntryController(service)
}
