import { IHttp } from "@rocket.chat/apps-engine/definition/accessors"
import { SpreadSheet } from "../../domain/contracts/gateways/spreadsheet"
import { Environments } from "../../domain/entities/environments"
import { left, right } from "../../main/shared/either"
import { InternalServerError } from "../errors/internal-server-error"

export class GoogleSpreadSheets implements SpreadSheet {
  constructor (
    private readonly environments: Environments,
    private readonly httpRequest: IHttp
  ) {}

  public async loadValuesInDataSheet (): Promise<SpreadSheet.loadValuesInDataSheet.Result> {
    try {
      const result = await this.httpRequest.post(this.environments.urlApiConnector.concat("/spreadsheet/list"), {
        data: {
          credentials: this.environments.googleCrendentials,
          fields: this.environments.fieldsHeader,
          spreadSheetId: this.environments.spreadsheetsId,
          spreadSheetTabName: this.environments.spreadSheetPageName
        }
      })

      if (result.statusCode !== 200) {
        return left(new InternalServerError(new Error(`Invalid request with status code ${result.statusCode}`)))
      }
      return right(result.data)
    } catch (error) {
      return left(new InternalServerError(error))
    }
  }
}
