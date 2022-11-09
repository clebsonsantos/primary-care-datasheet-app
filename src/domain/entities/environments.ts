interface ObjectKey {
  [key: string]: string
}

export class Environments {
  public spreadsheetsId: string
  public googleCrendentials: ObjectKey

  constructor (params: {
    spreadsheetsId: string
    googleCrendentials: ObjectKey
  }) {
    Object.assign(this, params)
    Object.freeze(this)
  }

  public static empty (): Environments {
    return new Environments({
      spreadsheetsId: "",
      googleCrendentials: {}
    })
  }

  public isValid (): boolean {
    if (
      !this.spreadsheetsId ||
      !Object.values(this.googleCrendentials).length
    ) {
      return false
    }
    return true
  }

  public getValue (): this {
    return this
  }
}
