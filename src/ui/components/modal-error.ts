import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"
import { ModalViewResponse } from "./modal"

export const viewModalError = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string): IUIKitResponse => {
  const modal = new ModalViewResponse(modify, context, message, "Error", "error")
  return modal.render()
}
