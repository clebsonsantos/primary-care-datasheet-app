import { ChangeDataSheet } from "../../domain/usecases/change-data-sheet-values"
import { Controller } from "./controller"

export class ChangeDataController implements Controller {
  constructor (private readonly service: ChangeDataSheet) {}

  async handle (): Promise<Error | any[]> {
    try {
      const result = await this.service.perform()
      return result.isLeft()
        ? new Error(result.value)
        : result.value
    } catch (error) {
      return new Error(error.message)
    }
  }
}
