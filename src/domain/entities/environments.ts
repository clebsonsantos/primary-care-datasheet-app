interface ObjectKey {
  [key: string]: string
}
type Env = Omit<Environments, "empty" | "isValid" | "getValue" | "setFieldsHeader">

export class Environments {
  public spreadsheetsId: string
  public urlApiConnector: string
  public fieldsHeader: string[]
  public spreadSheetPageName: string
  public googleCrendentials: ObjectKey

  constructor (params: Env) {
    Object.assign(this, params)
  }

  public static empty (): Environments {
    return new Environments({
      spreadsheetsId: "",
      googleCrendentials: {},
      fieldsHeader: [],
      spreadSheetPageName: "",
      urlApiConnector: ""
    })
  }

  public isValid (): boolean {
    if (
      !this.spreadsheetsId ||
      !this.fieldsHeader.length ||
      !this.spreadSheetPageName ||
      !this.urlApiConnector ||
      !Object.values(this.googleCrendentials).length
    ) {
      return false
    }
    return true
  }

  public getValue (): this {
    return this
  }

  public setFieldsHeader (fields: string[]): this {
    this.fieldsHeader = fields
    return this
  }
}
