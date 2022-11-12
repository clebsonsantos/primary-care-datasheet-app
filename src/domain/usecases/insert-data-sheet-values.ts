import { Either, left, right } from "../../main/shared/either"
import { Connector } from "../contracts/gateways/connector"

export type InserDataSheet = {
  perform: (values: Input) => Promise<Output>
}
type Input = { [key: string]: string }
type Output = Either<string, { id: string }>

export class InserDataSheetValues {
  constructor (
    private readonly spreadSheetConnector: Connector
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
