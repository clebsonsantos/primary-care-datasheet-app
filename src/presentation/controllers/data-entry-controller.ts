import { InserDataSheet } from "../../domain/usecases/insert-data-sheet-values"

export class DataEntryController {
  constructor (private readonly service: InserDataSheet) {}

  async handle (data: object): Promise<Error | object> {
    try {
      const values = this.processData(data)

      if (!this.dataIsValid(values)) {
        return new Error("You cannot submit an empty form")
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
