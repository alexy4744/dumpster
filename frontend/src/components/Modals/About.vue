<template>
  <Modal ref="aboutModal" title="About" :buttons="['OK']" @OK-clicked="close">
    <div>
      <a href="https://github.com/alexy4744/Dumpster">GitHub</a>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Modal from "@/components/Modal.vue";

@Component({
  components: {
    Modal
  }
})
export default class About extends Vue {
  public readonly $refs!: {
    aboutModal: Modal;
  };

  public close(): void {
    this.$refs.aboutModal.close();
  }
}
</script>