import { IModify } from "@rocket.chat/apps-engine/definition/accessors"
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit"
import { I18nScope } from "../../domain/entities/i18n"
import { ModalViewResponse } from "./modal"

export const viewModalSuccess = (modify: IModify, context: UIKitViewSubmitInteractionContext, message: string, i18n: I18nScope): IUIKitResponse => {
  const modal = new ModalViewResponse(modify, context, message, i18n.success_modal_title, "success", i18n.button_close_title)
  return modal.render()
}
