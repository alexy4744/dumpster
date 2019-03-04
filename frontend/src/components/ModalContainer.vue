<!-- Component to abstract modal displaying -->

<template>
  <div ref="modalContainer">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Modal from "@/components/Modal.vue";

import ModalGenerator from "@/utils/ModalGenerator";

@Component
export default class ModalContainer extends Vue {
  public readonly $refs!: {
    modalContainer: HTMLDivElement;
  };

  public readonly modalGenerator: ModalGenerator = new ModalGenerator(this);

  public displayModal(modal: Vue | string): Promise<Vue> {
    return new Promise<Vue>(
      async (resolve, reject): Promise<void> => {
        if (typeof modal === "string") {
          try {
            // tslint:disable-next-line:arrow-parens
            const ThatModal = await import(`@/components/Modals/${modal}`).then(module => module.default);
            if (!ThatModal) {
              this.displayError(new Error(`${modal} has no default export!`));
              return reject();
            }

            const theModal: Vue = new ThatModal({ parent: this }).$mount();

            this.$refs.modalContainer.appendChild(theModal.$el);

            return resolve(theModal);
          } catch (error) {
            this.displayError(error);
          }
        } else {
          modal.$mount();
          this.$refs.modalContainer.appendChild(modal.$el);
        }
      }
    );
  }

  public displayConfirmation(title: string, description: string): void {
    const confirmationModal: Modal = this.modalGenerator.createConfirmation(title, description);
    this.$refs.modalContainer.appendChild(confirmationModal.$el);
  }

  public displayError(error: Error): void {
    const errorModal: Modal = this.modalGenerator.createError(error);
    this.$refs.modalContainer.appendChild(errorModal.$el);
  }
}
</script>