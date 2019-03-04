<template>
  <Modal ref="uploadResult" title="File uploaded!" :buttons="['OK']" @OK-clicked="close">
    <template v-if="files.length > 0">
      <div class="files">
        <template v-for="file of files">
          <div class="files__file" :key="file.id">
            <span class="file__name">{{ file.originalname }}</span>
            <Clipboard :link="$data.FRONTEND_URL + '/' + file.id"/>
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Clipboard from "@/components/Clipboard.vue";
import Modal from "@/components/Modal.vue";

import File from "@/interfaces/File";

@Component({
  components: {
    Clipboard,
    Modal
  }
})
export default class UploadResult extends Vue {
  public readonly $refs!: {
    uploadResult: Modal;
  };

  @Prop({
    type: Array,
    default: []
  })
  private readonly files!: File[];

  private close(): void {
    this.$refs.uploadResult.close();
  }
}
</script>

<style lang="scss" scoped>
.files__file:not(:last-child) {
  margin-bottom: 15px;
}

.file__name {
  display: block;
  color: inherit;
  margin-bottom: 5px;
}
</style>
