import { SpreadSheet } from "../../../../domain/contracts/gateways/spreadsheet"
import { InserDataSheetValues } from "../../../../domain/usecases/insert-data-sheet-values"

export const makeInsertDataSheetValues = (spreadsheetConnector: SpreadSheet): InserDataSheetValues => {
  return new InserDataSheetValues(spreadsheetConnector)
}
