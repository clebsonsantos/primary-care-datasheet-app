import { InternalServerError } from "../../../infra/errors/internal-server-error"
import { Either } from "../../../main/shared/either"

export interface SpreadSheet {
  loadValuesInDataSheet: () => Promise<SpreadSheet.loadValuesInDataSheet.Result>
  insertValuesInDataSheet: (params: SpreadSheet.insertValuesInDataSheet.Params) => Promise<SpreadSheet.insertValuesInDataSheet.Result>
}

export namespace SpreadSheet {
  export namespace loadValuesInDataSheet {
    export type Result = Either<InternalServerError, any[]>
  }
  export namespace insertValuesInDataSheet {
    export type Params = { values: { [key: string]: string } }
    export type Result = Either<InternalServerError, { id: string }>
  }
}
