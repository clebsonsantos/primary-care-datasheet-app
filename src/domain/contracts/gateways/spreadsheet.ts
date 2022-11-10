import { InternalServerError } from "../../../infra/errors/internal-server-error"
import { Either } from "../../../main/shared/either"

export interface SpreadSheet {
  loadValuesInDataSheet: () => Promise<SpreadSheet.loadValuesInDataSheet.Result>
}

export namespace SpreadSheet {
  export namespace loadValuesInDataSheet {
    export type Result = Either<InternalServerError, any[]>
  }
}
