import { BlockBuilder, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"

type Input = {
  block: BlockBuilder
  element: string
  defaultValues?: object
  blockId?: string
  actionId?: string
}

export const inputBlock = ({ block, element, actionId, blockId, defaultValues }: Input): void => {
  block.addInputBlock({
    blockId: blockId && actionId ? blockId : element,
    element: block.newPlainTextInputElement({
      actionId: blockId && actionId ? actionId : element,
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
