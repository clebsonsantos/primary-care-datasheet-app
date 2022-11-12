import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, TextObjectType, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"

export const viewModalWarning = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string): IUIKitResponse => {
  const block = modify.getCreator().getBlockBuilder()

  block.addContextBlock({
    elements: [block.newPlainTextObject(`⚠ ${message}`)],
    blockId: "warning"
  })
  return context.getInteractionResponder().openModalViewResponse({
    title: {
      text: "Warning",
      type: TextObjectType.PLAINTEXT,
      emoji: true
    },
    blocks: block.getBlocks(),
    id: "warning",
    clearOnClose: false
  })
}
