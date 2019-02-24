/* Way to programatically generate basic modals as alternative */

import Modal from "@/components/Modal.vue";
import Vue, { VNode } from "vue";

interface Buttons {
  [key: string]: (event: MouseEvent, modal: Modal) => void;
}

export default class ModalGenerator {
  private readonly modalParent: Vue;

  public constructor(parent: Vue) {
    this.modalParent = parent;
  }

  public createModal(title: string, description: string, buttons?: Buttons): Modal {
    const buttonNames: string[] = buttons ? Object.keys(buttons) : [];
    const thisModal: Modal = new Modal({
      parent: this.modalParent,
      propsData: {
        title,
        buttons: buttonNames.length > 0 ? buttonNames : ["OK"]
      }
    });

    const node: VNode = this.modalParent.$createElement("span", description);

    thisModal.$slots.default = [node];
    thisModal.$mount();

    if (buttonNames.length > 0) {
      for (const name of buttonNames) {
        if (!buttons) continue;

        thisModal.$on(`${name}-clicked`, (event: MouseEvent): void => buttons[name](event, thisModal));
      }
    }

    return thisModal;
  }

  public createConfirmation(title: string, description: string): Modal {
    return this.createModal(title, description, {
      // @ts-ignore
      OK: (event: MouseEvent, modal: Modal): void => modal.close()
    });
  }

  public createError(error: Error): Modal {
    return this.createConfirmation("Error!", error.message);
  }
}
