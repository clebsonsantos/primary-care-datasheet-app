import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { Connector } from "../../domain/contracts/gateways/connector"
import { Environments } from "../../domain/entities/environments"
import { left, right } from "../../main/shared/either"
import { InternalServerError } from "../errors/internal-server-error"

type ObjectData = {
  [key: string]: string
}
export class SpreadSheetConnector implements Connector {
  private readonly data: {
    credentials: ObjectData
    fields: string[]
    spreadSheetId: string
    spreadSheetTabName: string
    values?: ObjectData
  }

  constructor (
    private readonly environments: Environments,
    private readonly httpRequest: IHttp
  ) {
    this.data = {
      credentials: this.environments.googleCrendentials,
      fields: this.environments.fieldsHeader,
      spreadSheetId: this.environments.spreadsheetsId,
      spreadSheetTabName: this.environments.spreadSheetPageName
    }
  }

  public async loadValuesInDataSheet (): Promise<Connector.loadValuesInDataSheet.Result> {
    return await this.resolver(async () => {
      const result = await this.httpRequest.post(this.environments.urlApiConnector.concat("/spreadsheet/list"), {
        data: this.data
      })

      if (result.statusCode !== 200) {
        return left(new InternalServerError(new Error(`Invalid request with status code ${result.statusCode}`)))
      }
      return right(result.data)
    })
  }

  public async insertOrUpdateValuesInWorksheet ({ values }: Connector.insertOrUpdateValuesInWorksheet.Params): Promise<Connector.insertOrUpdateValuesInWorksheet.Result> {
    return await this.resolver(async () => {
      this.data.values = values
      const callMethod = values.ID ? "update" : "add"

      const result = await this.httpRequest.post(this.environments.urlApiConnector.concat(`/spreadsheet/${callMethod}`), {
        data: this.data
      })

      if (result.statusCode !== 200) {
        return left(new InternalServerError(new Error(`Invalid request with status code ${result.statusCode}`)))
      }
      return right(result.data.id)
    })
  }

  protected async resolver (handler: unknown): Promise<Error | any> {
    try {
      if (typeof handler === "function") {
        return handler()
      }
    } catch (error) {
      return left(new InternalServerError(error))
    }
  }
}
