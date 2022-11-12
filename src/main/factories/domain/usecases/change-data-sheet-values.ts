import { Connector } from "../../../../domain/contracts/gateways/connector"
import { ChangeDataSheetValues } from "../../../../domain/usecases/change-data-sheet-values"

export const makeChangeDataSheetValues = (spreadsheetConnector: Connector): ChangeDataSheetValues => {
  return new ChangeDataSheetValues(spreadsheetConnector)
}
