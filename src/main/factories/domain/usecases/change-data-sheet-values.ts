import { SpreadSheet } from "../../../../domain/contracts/gateways/spreadsheet"
import { ChangeDataSheetValues } from "../../../../domain/usecases/change-data-sheet-values"

export const makeChangeDataSheetValues = (spreadsheetConnector: SpreadSheet): ChangeDataSheetValues => {
  return new ChangeDataSheetValues(spreadsheetConnector)
}
