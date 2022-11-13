import { BlockBuilder, IOptionObject, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"

export const selectBlock = (block: BlockBuilder, optionsObject: IOptionObject[]): void => {
  block.addInputBlock({
    blockId: "selected",
    element: block.newStaticSelectElement({
      placeholder: { text: "Select which field you want to search", type: TextObjectType.PLAINTEXT },
      options: optionsObject,
      actionId: "this"
    }),
    label: {
      type: TextObjectType.PLAINTEXT,
      text: "Selected field",
      emoji: false

    },
    optional: false
  })
}
