import { BlockBuilder, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"

type Input = {
  block: BlockBuilder
  element: string
  placeholder: string
  defaultValues?: object
  blockId?: string
  actionId?: string
}

export const inputBlock = ({ block, element, actionId, blockId, defaultValues, placeholder }: Input): void => {
  block.addInputBlock({
    blockId: blockId && actionId ? blockId : element,
    element: block.newPlainTextInputElement({
      actionId: blockId && actionId ? actionId : element,
      initialValue: defaultValues ? defaultValues[element.toLowerCase()] : undefined,
      placeholder: {
        text: `${placeholder} ${element.toLowerCase()}`,
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
