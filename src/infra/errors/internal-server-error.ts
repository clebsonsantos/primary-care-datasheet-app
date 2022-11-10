
export class InternalServerError extends Error {
  constructor (error: Error) {
    super(`Server failed. Try again soon. ${error.message}`)
    this.name = "InternalServerError"
  }
}
