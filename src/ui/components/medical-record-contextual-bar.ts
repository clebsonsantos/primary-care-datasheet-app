import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"
import { ContextualBarEnum } from "../enum/contextual-bar"
import { inputBlock } from "./input-block"

export type ContextualBar = (modify: IModify, fields: string[], defaultValues?: object) => IUIKitContextualBarViewParam
export const medicalRecordContextualBar: ContextualBar = (modify: IModify, fields: string[], defaultValues?: object): IUIKitContextualBarViewParam => {
  const block = modify.getCreator().getBlockBuilder()

  for (const element of fields) {
    void inputBlock({
      block,
      element,
      defaultValues
    })
  }

  const view: IUIKitContextualBarViewParam = {
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

  return view
}
