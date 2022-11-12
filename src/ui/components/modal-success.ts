import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"
import { ModalViewResponse } from "./modal"

export const viewModalSuccess = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string): IUIKitResponse => {
  const modal = new ModalViewResponse(modify, context, message, "Success", "success")
  return modal.render()
}
