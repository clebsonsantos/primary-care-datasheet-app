
import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, IUIKitResponse, TextObjectType, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"

export class ModalViewResponse {
  constructor (
    private readonly modify: IModify,
    private readonly context: UIKitViewSubmitInteractionContext,
    private readonly message: string,
    private readonly title: string,
    private readonly id: string,
    private readonly buttonCloseTitle: string
  ) {}

  public render (): IUIKitResponse {
    const block = this.modify.getCreator().getBlockBuilder()

    block.addContextBlock({
      elements: [block.newPlainTextObject(`☑ ${this.message}`)],
      blockId: this.id
    })

    return this.context.getInteractionResponder().openModalViewResponse({
      title: {
        text: this.title,
        type: TextObjectType.PLAINTEXT,
        emoji: true
      },
      blocks: block.getBlocks(),
      id: this.id,
      clearOnClose: false,
      close: block.newButtonElement({
        text: {
          type: TextObjectType.PLAINTEXT,
          text: this.buttonCloseTitle,
          emoji: true
        },
        style: ButtonStyle.DANGER
      })
    })
  }
}
