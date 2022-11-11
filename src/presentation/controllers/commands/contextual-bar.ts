import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"

export function openContextualBar (modify: IModify, fields: string[]): IUIKitContextualBarViewParam {
  const block = modify.getCreator().getBlockBuilder()

  for (const element of fields) {
    block.addInputBlock({
      blockId: element,
      element: block.newPlainTextInputElement({
        actionId: element,
        placeholder: {
          text: `Fill here with a valid value for ${element.toLowerCase()}`,
          type: TextObjectType.PLAINTEXT
        }
      }),
      label: {
        type: TextObjectType.PLAINTEXT,
        text: element,
        emoji: false

      },
      optional: false
    })
  }

  const contextualBar: IUIKitContextualBarViewParam = {
    id: "primary-care-contextual-bar",
    blocks: block.getBlocks(),
    title: { text: "Medical record", type: TextObjectType.PLAINTEXT },
    submit: block.newButtonElement({
      text: {
        type: TextObjectType.PLAINTEXT,
        text: "Submit"
      },
      style: ButtonStyle.PRIMARY

    })
  }

  return contextualBar
}
