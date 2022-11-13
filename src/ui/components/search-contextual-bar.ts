import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, IOptionObject, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"
import { I18nScope } from "../../domain/entities/i18n"
import { ContextualBarEnum } from "../enum/contextual-bar"
import { inputBlock } from "./input-block"
import { selectBlock } from "./select-block"

export type ContextualBarSync = (modify: IModify, fields: string[], i18n: I18nScope, defaultValues?: object) => Promise<IUIKitContextualBarViewParam>

export const searchContextualBar: ContextualBarSync = async (modify: IModify, fields: string[], i18n: I18nScope, defaultValues?: object): Promise<IUIKitContextualBarViewParam> => {
  const block = modify.getCreator().getBlockBuilder()

  const optionsObject: IOptionObject[] = []
  for await (const element of fields) {
    optionsObject.push({ text: { text: element, type: TextObjectType.PLAINTEXT }, value: element })
  }

  void selectBlock(block, optionsObject, i18n)
  void inputBlock({
    block,
    element: i18n.default_value_to_search_input_block,
    blockId: ContextualBarEnum.INPUT_SEARCH_ID,
    actionId: "value",
    placeholder: i18n.placeholder_input_block_element
  })

  const view: IUIKitContextualBarViewParam = {
    id: "primary-care-find-by-field",
    blocks: block.getBlocks(),
    title: { text: i18n.search_contextual_bar_title, type: TextObjectType.PLAINTEXT },
    submit: block.newButtonElement({
      text: {
        type: TextObjectType.PLAINTEXT,
        text: i18n.button_submit_title
      },
      style: ButtonStyle.PRIMARY
    })
  }
  return view
}
