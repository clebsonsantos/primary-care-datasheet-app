import { Either, left, right } from "../../main/shared/either"
import { Connector } from "../contracts/gateways/connector"

export type ChangeDataSheet = {
  perform: () => Promise<Output>
}
type Output = Either<string, any[]>

export class ChangeDataSheetValues {
  constructor (
    private readonly spreadSheetConnector: Connector
  ) {}

  public async perform (): Promise<Output> {
    const data = await this.spreadSheetConnector.loadValuesInDataSheet()

    return data.isLeft()
      ? left(data.value.message)
      : right(data.value)
  }
}
