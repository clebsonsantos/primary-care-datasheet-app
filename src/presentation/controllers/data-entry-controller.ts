import { InserDataSheet } from "../../domain/usecases/insert-data-sheet-values"
import { Controller } from "./controller"

export class DataEntryController implements Controller {
  constructor (
    private readonly service: InserDataSheet,
    private readonly errori18n: string
  ) {}

  async handle (data: object, processData?: boolean): Promise<Error | object> {
    try {
      const values = processData ? this.processData(data) : data

      if (!this.dataIsValid(values)) {
        return new Error(this.errori18n)
      }

      const result = await this.service.perform(values as any)
      return result.isLeft()
        ? new Error(result.value)
        : result.value
    } catch (error) {
      return new Error(error)
    }
  }

  protected processData (data: object): object {
    const body = {}
    for (const [key, value] of Object.entries(data)) {
      body[key] = value[key]
    }
    return body
  }

  protected dataIsValid (data: object): boolean {
    for (const [, value] of Object.entries(data)) {
      if (!value.trim().length) {
        return false
      }
    }
    return true
  }
}
