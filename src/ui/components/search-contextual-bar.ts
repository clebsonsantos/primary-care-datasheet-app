import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { ButtonStyle, IOptionObject, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit"
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder"
import { ContextualBarEnum } from "../enum/contextual-bar"
import { inputBlock } from "./input-block"
import { selectBlock } from "./select-block"

export type ContextualBarSync = (modify: IModify, fields: string[], defaultValues?: object) => Promise<IUIKitContextualBarViewParam>

export const searchContextualBar: ContextualBarSync = async (modify: IModify, fields: string[], defaultValues?: object): Promise<IUIKitContextualBarViewParam> => {
  const block = modify.getCreator().getBlockBuilder()

  const optionsObject: IOptionObject[] = []
  for await (const element of fields) {
    optionsObject.push({ text: { text: element, type: TextObjectType.PLAINTEXT }, value: element })
  }

  void selectBlock(block, optionsObject)
  void inputBlock({
    block,
    element: "Value",
    blockId: ContextualBarEnum.INPUT_SEARCH_ID,
    actionId: "value"
  })

  const view: IUIKitContextualBarViewParam = {
    id: "primary-care-find-by-field",
    blocks: block.getBlocks(),
    title: { text: "Search by a field", type: TextObjectType.PLAINTEXT },
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
