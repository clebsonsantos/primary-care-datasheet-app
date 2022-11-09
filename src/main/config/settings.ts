import { IConfigurationExtend } from "@rocket.chat/apps-engine/definition/accessors"
import { SettingType } from "@rocket.chat/apps-engine/definition/settings"

export class Settings {
  private readonly configuration: IConfigurationExtend

  constructor (configuration: IConfigurationExtend) {
    this.configuration = configuration
  }

  public async createSettings (): Promise<void> {
    const sectionName = "PrimaryCareDataSheets"

    await this.configuration.settings.provideSetting({
      id: "SPREADSHEET_ID",
      type: SettingType.STRING,
      value: "",
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Spreadsheet ID",
      i18nPlaceholder: "SPREADSHEET_ID_PLACE_HOLDER"
    })

    await this.configuration.settings.provideSetting({
      id: "GOOGLE_CREDENTIALS",
      type: SettingType.CODE,
      value: "",
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Google credentials",
      i18nPlaceholder: "GOOGLE_CREDENTIALS_PLACE_HOLDER"
    })
  }
}
