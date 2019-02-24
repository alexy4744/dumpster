<template>
  <Modal
    ref="uploadModal"
    title="Upload"
    :buttons="['Upload', 'Cancel']"
    @Upload-clicked="upload"
    @Cancel-clicked="cancel"
  >
    <input ref="filePicker" class="file-picker" type="file" multiple @change="readFiles">

    <div ref="selectedFiles" class="files">
      <template v-for="file of selectedFiles">
        <div :key="file.name" class="file">
          <span class="file__name">{{ file.name }}</span>
          <span class="file__size">{{ file.size }} bytes</span>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script lang="ts">
import { VNode } from "vue";
import { Component, Prop, Vue } from "vue-property-decorator";

import Modal from "@/components/Modal.vue";
import UploadHandler from "@/utils/UploadHandler";

@Component({
  components: {
    Modal
  }
})
export default class Upload extends Vue {
  public $refs!: {
    uploadModal: Modal;
    filePicker: HTMLInputElement;
    selectedFiles: HTMLDivElement;
  };

  private readonly uploadHandler: UploadHandler = new UploadHandler();
  private selectedFiles: File[] = [];

  private readFiles() {
    const files: FileList | null = this.$refs.filePicker.files;
    if (!files) return;

    this.selectedFiles = Array.from(files);
  }

  private upload(): void {
    if (!this.selectedFiles.length) return;

    const formData: FormData = new FormData();

    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < this.selectedFiles.length; i++) {
      formData.append("", this.selectedFiles[i]);
    }

    this.uploadHandler.upload(formData);
    // .then(this.onUploadFinish)
    // .catch(this.displayError);
  }

  private cancel(): void {
    this.$refs.uploadModal.close();
  }
}
</script>

<style lang="scss" scoped>
.file-picker {
  width: inherit;
}

.files {
  max-height: 50vh;
  overflow: auto;
  padding-right: 15px;
}

.file {
  margin: 15px 0;
}

.file__name {
  font-weight: 800;
  word-wrap: break-word;
}

.file__size {
  float: right;
  // display: inline-block;
}
</style>
