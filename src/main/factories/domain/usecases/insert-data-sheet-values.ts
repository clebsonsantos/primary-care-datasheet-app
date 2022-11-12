import { Connector } from "../../../../domain/contracts/gateways/connector"
import { InserDataSheetValues } from "../../../../domain/usecases/insert-data-sheet-values"

export const makeInsertDataSheetValues = (spreadsheetConnector: Connector): InserDataSheetValues => {
  return new InserDataSheetValues(spreadsheetConnector)
}
