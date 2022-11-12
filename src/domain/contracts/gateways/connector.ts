import { InternalServerError } from "../../../infra/errors/internal-server-error"
import { Either } from "../../../main/shared/either"

export interface Connector {
  loadValuesInDataSheet: () => Promise<Connector.loadValuesInDataSheet.Result>
  insertValuesInDataSheet: (params: Connector.insertValuesInDataSheet.Params) => Promise<Connector.insertValuesInDataSheet.Result>
}

export namespace Connector {
  export namespace loadValuesInDataSheet {
    export type Result = Either<InternalServerError, any[]>
  }
  export namespace insertValuesInDataSheet {
    export type Params = { values: { [key: string]: string } }
    export type Result = Either<InternalServerError, { id: string }>
  }
}
