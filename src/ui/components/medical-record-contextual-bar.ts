import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"
import { I18nScope } from "../../domain/entities/i18n"
import { ContextualBarEnum } from "../enum/contextual-bar"
import { inputBlock } from "./input-block"

export type ContextualBar = (modify: IModify, fields: string[], i18n: I18nScope, defaultValues?: object) => IUIKitContextualBarViewParam
export const medicalRecordContextualBar: ContextualBar = (modify: IModify, fields: string[], i18n: I18nScope, defaultValues?: object): IUIKitContextualBarViewParam => {
  const block = modify.getCreator().getBlockBuilder()

  for (const element of fields) {
    void inputBlock({
      block,
      element,
      defaultValues,
      placeholder: i18n.placeholder_input_block_element
    })
  }

  const view: IUIKitContextualBarViewParam = {
    id: defaultValues ? defaultValues["id"] : ContextualBarEnum.CONTEXTUAL_ID,
    blocks: block.getBlocks(),
    title: { text: i18n.medical_record_contextual_bar_title, type: TextObjectType.PLAINTEXT },
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
