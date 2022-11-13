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
      id: "I18N",
      type: SettingType.SELECT,
      values: [
        { key: "pt-BR", i18nLabel: "PT-BR" },
        { key: "en-US", i18nLabel: "EN-US" }
      ],
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Select in which language you want to view the app responses",
      i18nPlaceholder: "I18N_PLACE_HOLDER"
    })

    await this.configuration.settings.provideSetting({
      id: "SPREADSHEET_CONNECTOR_URL_API",
      type: SettingType.STRING,
      value: "",
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Spreadsheet connector url api",
      i18nDescription: "You need to have a SpreadSheetConnector server online. See at: https://github.com/clebsonsantos/spreadsheet-connector",
      i18nPlaceholder: "SPREADSHEET_CONNECTOR_URL_API_PLACE_HOLDER"
    })

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
      id: "FIELDS_SPREADSHEET_HEADER",
      type: SettingType.STRING,
      value: "",
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Fields Spreadsheet header",
      i18nDescription: "Comma separated fields",
      i18nPlaceholder: "FIELDS_SPREADSHEET_HEADER_PLACE_HOLDER"
    })

    await this.configuration.settings.provideSetting({
      id: "SPREADSHEET_PAGE_NAME",
      type: SettingType.STRING,
      value: "",
      packageValue: "",
      required: true,
      public: false,
      section: sectionName,
      i18nLabel: "Spreadsheet page name",
      i18nPlaceholder: "SPREADSHEET_PAGE_NAME_PLACE_HOLDER"
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
