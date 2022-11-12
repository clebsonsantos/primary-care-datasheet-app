import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, TextObjectType, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"

export const viewModalSuccess = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string): IUIKitResponse => {
  const block = modify.getCreator().getBlockBuilder()

  block.addContextBlock({
    elements: [block.newPlainTextObject(`☑ ${message}`)],
    blockId: "success"
  })

  return context.getInteractionResponder().openModalViewResponse({
    title: {
      text: "Success",
      type: TextObjectType.PLAINTEXT,
      emoji: true
    },
    blocks: block.getBlocks(),
    id: "success",
    clearOnClose: false
  })
}
