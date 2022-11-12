import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors"
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands"
import { ContextualBar } from "../../ui/components/contextual-bar"

export class SubmitSlashcommand implements ISlashCommand {
  public command = "primary-care-medical-record"
  public i18nParamsExample = "open-primary-care-medical-record"
  public i18nDescription = "open-primary-care-medical-record"
  public providesPreview = false
  constructor (private readonly contextualBar: ContextualBar) {}

  public async executor (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
    const user = context.getSender()
    const triggerId = context.getTriggerId() as string
    const settings = read.getEnvironmentReader().getSettings()
    const fields = await settings.getById("FIELDS_SPREADSHEET_HEADER").then(data => data.value.split(","))
    const view = this.contextualBar(modify, fields)
    await modify.getUiController().openContextualBarView(view, { triggerId }, user)
  }
}
