import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, TextObjectType, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"

export const viewModalError = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string): IUIKitResponse => {
  const block = modify.getCreator().getBlockBuilder()

  block.addContextBlock({
    elements: [block.newPlainTextObject(`⚠ ${message}`)],
    blockId: "error"
  })
  return context.getInteractionResponder().openModalViewResponse({
    title: {
      text: "Internal error",
      type: TextObjectType.PLAINTEXT,
      emoji: true
    },
    blocks: block.getBlocks(),
    id: "error",
    clearOnClose: false
  })
}
