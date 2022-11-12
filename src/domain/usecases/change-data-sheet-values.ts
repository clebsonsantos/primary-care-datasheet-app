import { Either, left, right } from "../../main/shared/either"
import { Connector } from "../contracts/gateways/connector"

export type ChangeDataSheet = {
  perform: () => Promise<Either<string, any[]>>
}

export class ChangeDataSheetValues {
  constructor (
    private readonly spreadSheetConnector: Connector
  ) {}

  public async perform (): Promise<Either<string, any[]>> {
    const data = await this.spreadSheetConnector.loadValuesInDataSheet()

    return data.isLeft()
      ? left(data.value.message)
      : right(data.value)
  }
}
