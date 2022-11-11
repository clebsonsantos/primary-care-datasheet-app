import { Either, left, right } from "../../main/shared/either"
import { SpreadSheet } from "../contracts/gateways/spreadsheet"

export type InserDataSheet = {
  perform: (values: Input) => Promise<Output>
}
type Input = { [key: string]: string }
type Output = Either<string, { id: string }>

export class InserDataSheetValues {
  constructor (
    private readonly spreadSheetConnector: SpreadSheet
  ) {}

  public async perform (values: Input): Promise<Output> {
    const data = await this.spreadSheetConnector.insertValuesInDataSheet({
      values
    })

    return data.isLeft()
      ? left(data.value.message)
      : right(data.value)
  }
}
