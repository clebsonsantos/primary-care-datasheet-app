import { BlockBuilder, IOptionObject, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { I18nScope } from "../../domain/entities/i18n"

export const selectBlock = (block: BlockBuilder, optionsObject: IOptionObject[], i18n: I18nScope): void => {
  block.addInputBlock({
    blockId: "selected",
    element: block.newStaticSelectElement({
      placeholder: { text: i18n.placeholder_select_block_element, type: TextObjectType.PLAINTEXT },
      options: optionsObject,
      actionId: "this"
    }),
    label: {
      type: TextObjectType.PLAINTEXT,
      text: i18n.label_select_block_element,
      emoji: false

    },
    optional: false
  })
}
