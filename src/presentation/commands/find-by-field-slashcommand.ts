import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors"
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands"
import { ButtonStyle, IOptionObject, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"

export class FindByFieldCommand implements ISlashCommand {
  public command = "primary-care-find-by-field"
  public i18nParamsExample = "open-primary-care-find-by-field"
  public i18nDescription = "open-primary-care-find-by-field"
  public providesPreview = false

  public async executor (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
    const user = context.getSender()
    const triggerId = context.getTriggerId() as string
    const block = modify.getCreator().getBlockBuilder()

    const settings = read.getEnvironmentReader().getSettings()
    const fields = await settings.getById("FIELDS_SPREADSHEET_HEADER").then(data => data.value.split(",")) as string[]

    const optionsObject: IOptionObject[] = []
    for await (const element of fields) {
      optionsObject.push({ text: { text: element, type: TextObjectType.PLAINTEXT }, value: element })
    }

    block.addInputBlock({
      blockId: "selected",
      element: block.newStaticSelectElement({
        placeholder: { text: "Select which field you want to search", type: TextObjectType.PLAINTEXT },
        options: optionsObject,
        actionId: "this"
      }),
      label: {
        type: TextObjectType.PLAINTEXT,
        text: "Selected field",
        emoji: false

      },
      optional: false
    })

    block.addInputBlock({
      blockId: "input",
      element: block.newPlainTextInputElement({
        actionId: "value",
        placeholder: {
          text: `Fill here with a valid value for the selected field`,
          type: TextObjectType.PLAINTEXT
        }
      }),
      label: {
        type: TextObjectType.PLAINTEXT,
        text: "Value",
        emoji: false

      },
      optional: false
    })

    const view: IUIKitContextualBarViewParam = {
      id: "primary-care-find-by-field",
      blocks: block.getBlocks(),
      title: { text: "Search by a field", type: TextObjectType.PLAINTEXT },
      submit: block.newButtonElement({
        text: {
          type: TextObjectType.PLAINTEXT,
          text: "Submit"
        },
        style: ButtonStyle.PRIMARY
      })
    }

    await modify.getUiController().openContextualBarView(view, { triggerId }, user)
  }
}
