import { InternalServerError } from "../../../infra/errors/internal-server-error"
import { Either } from "../../../main/shared/either"

export interface Connector {
  loadValuesInDataSheet: () => Promise<Connector.loadValuesInDataSheet.Result>
  insertOrUpdateValuesInWorksheet: (params: Connector.insertOrUpdateValuesInWorksheet.Params) => Promise<Connector.insertOrUpdateValuesInWorksheet.Result>
}

export namespace Connector {
  export namespace loadValuesInDataSheet {
    export type Result = Either<InternalServerError, any[]>
  }
  export namespace insertOrUpdateValuesInWorksheet {
    export type Params = { values: { [key: string]: string } }
    export type Result = Either<InternalServerError, { id: string }>
  }
}
