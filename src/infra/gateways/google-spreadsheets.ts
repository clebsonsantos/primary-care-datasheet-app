import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { SpreadSheet } from "../../domain/contracts/gateways/spreadsheet"
import { Environments } from "../../domain/entities/environments"
import { left, right } from "../../main/shared/either"
import { InternalServerError } from "../errors/internal-server-error"

export class GoogleSpreadSheets implements SpreadSheet {
  private readonly data: {
    credentials: {
      [key: string]: string
    }
    fields: string[]
    spreadSheetId: string
    spreadSheetTabName: string
    values?: {
      [key: string]: string
    }
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

  public async loadValuesInDataSheet (): Promise<SpreadSheet.loadValuesInDataSheet.Result> {
    try {
      const result = await this.httpRequest.post(this.environments.urlApiConnector.concat("/spreadsheet/list"), {
        data: this.data
      })

      if (result.statusCode !== 200) {
        return left(new InternalServerError(new Error(`Invalid request with status code ${result.statusCode}`)))
      }
      return right(result.data)
    } catch (error) {
      return left(new InternalServerError(error))
    }
  }

  public async insertValuesInDataSheet ({ values }: SpreadSheet.insertValuesInDataSheet.Params): Promise<SpreadSheet.insertValuesInDataSheet.Result> {
    try {
      this.data.values = values
      const result = await this.httpRequest.post(this.environments.urlApiConnector.concat("/spreadsheet/add"), {
        data: this.data
      })

      if (result.statusCode !== 200) {
        return left(new InternalServerError(new Error(`Invalid request with status code ${result.statusCode}`)))
      }
      return right(result.data.id)
    } catch (error) {
      return left(new InternalServerError(error))
    }
  }
}
