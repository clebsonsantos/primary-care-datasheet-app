import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"
import { ContextualBarEnum } from "../enum/contextual-bar"

export type ContextualBar = (modify: IModify, fields: string[], defaultValues?: object) => IUIKitContextualBarViewParam
export const openContextualBar: ContextualBar = (modify: IModify, fields: string[], defaultValues?: object): IUIKitContextualBarViewParam => {
  const block = modify.getCreator().getBlockBuilder()

  for (const element of fields) {
    block.addInputBlock({
      blockId: element,
      element: block.newPlainTextInputElement({
        actionId: element,
        initialValue: defaultValues ? defaultValues[element.toLowerCase()] : undefined,
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
    id: defaultValues ? defaultValues["id"] : ContextualBarEnum.CONTEXTUAL_ID,
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
