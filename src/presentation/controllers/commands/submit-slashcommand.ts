import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors"
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands"
import { openContextualBar } from "./contextual-bar"

export class SubmitSlashcommand implements ISlashCommand {
  public command = "primary-care-bar"
  public i18nParamsExample = "open-primary-care-bar"
  public i18nDescription = "open-primary-care-bar"
  public providesPreview = false

  public async executor (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
    const user = context.getSender()
    const triggerId = context.getTriggerId() as string
    const settings = read.getEnvironmentReader().getSettings()
    const fields = await settings.getById("FIELDS_SPREADSHEET_HEADER").then(data => data.value.split(","))
    const view = openContextualBar(modify, fields)
    void modify.getUiController().openContextualBarView(view, { triggerId }, user)
  }
}
