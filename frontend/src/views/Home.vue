<template>
  <div>
    <div class="wrapper">
      <Toolbar>
        <Category title="File">
          <Item name="New Paste"/>
          <Item name="New Upload"/>

          <br>

          <Item name="Save" @click="uploadPaste"/>
        </Category>

        <Category title="Edit">
          <Item name="Language"/>
          <Item name="Theme"/>
        </Category>

        <Category title="Help">
          <Item name="Changelog"/>
          <Item name="About"/>
        </Category>
      </Toolbar>

      <div ref="dropZone" id="dropZone">
        <CodeFlask ref="codeflask" @save="uploadPaste"/>
      </div>
    </div>

    <div ref="modalContainer">
      <Modal
        v-if="requestHandler.currentRequest"
        ref="uploadModal"
        class="uploadModal"
        title="Uploading"
        :buttons="['CANCEL']"
        @CANCEL-clicked="cancelUpload"
      >
        <Progress class="uploadProgress" width="256px" height="24px">
          <ProgressBar ref="uploadProgressBar" class="uploadProgressBar" progress="0%"/>
        </Progress>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import Toolbar from "@/components/Toolbar.vue";
import Category from "@/components/Toolbar/Category.vue";
import Item from "@/components/Toolbar/Category/Item.vue";
import CodeFlask from "@/components/CodeFlask.vue";
import Modal from "@/components/Modal.vue";
import Progress from "@/components/Progress.vue";
import ProgressBar from "@/components/Progress/Bar.vue";

import ModalGenerator from "@/utils/ModalGenerator";
import RequestHandler from "@/utils/RequestHandler";

import { VNode } from "vue";
import { Component, Vue } from "vue-property-decorator";
import { Response, ProgressEvent } from "superagent";

@Component({
  components: {
    Toolbar,
    Category,
    Item,
    CodeFlask,
    Modal,
    Progress,
    ProgressBar
  }
})
export default class Home extends Vue {
  public $refs!: {
    codeflask: CodeFlask;
    dropZone: HTMLDivElement;
    modalContainer: HTMLDivElement;
    uploadModal: Modal;
    uploadProgressBar: ProgressBar;
  };

  private readonly requestHandler: RequestHandler = new RequestHandler();
  private readonly modalGenerator: ModalGenerator = new ModalGenerator(this);

  public mounted(): void {
    this.$refs.dropZone.ondragover = (event: DragEvent): void => event.preventDefault();
    this.$refs.dropZone.ondrop = (event: DragEvent): void => {
      event.preventDefault();
      this.dropHandler(event);
    };

    this.requestHandler.on("progress", this.handleUploadProgress);
  }

  private uploadPaste(): void {
    const paste: string = this.$refs.codeflask.$refs.input.value;

    // If no text or the welcome message is still shown, don't upload
    if (paste.length < 1 || this.$refs.codeflask.welcomeIsDisplayed) {
      this.displayError(new Error("There is no paste to be uploaded!"));
      return;
    }

    this.requestHandler
      .upload({ paste })
      .then(this.onUploadFinish)
      .catch(this.displayError);
  }

  private uploadFiles(formData: FormData): void {
    this.requestHandler
      .upload(formData)
      .then(this.onUploadFinish)
      .catch(this.displayError);
  }

  private cancelUpload(): void {
    this.requestHandler
      .abortCurrentRequest()
      .catch(this.displayError);
  }

  private handleUploadProgress(event: ProgressEvent): void {
    if (!event.percent) return;
    if (!this.$refs.uploadProgressBar) return;

    this.$refs.uploadProgressBar.setProgress(event.percent);
  }

  private onUploadFinish(res: Response): void {
    const id: string = res.body.file ? res.body.file._id : res.body.paste ? res.body.paste._id : null;
    const filename: string = res.body.file ? res.body.file.filename : "your paste";

    this.displayConfirmation(
      "File Uploaded!",
      `You can use ${window.location.href + id} to share ${filename}!`
    );
  }

  private dropHandler(event: DragEvent): void {
    const files: FileList | null = event.dataTransfer ? event.dataTransfer.files : null;

    if (!files) {
      this.displayError(new Error(`No files were found during the drag and drop!`));
      return;
    }

    if (!this.validateFiles(files)) return;

    const formData = new FormData();

    formData.append("file", files[0]);
    /*                ^^
      Field name must match the one specified in multer */

    this.uploadFiles(formData);
  }

  private validateFiles(files: FileList): boolean {
    if (files.length > this.$data.MAX_FILE_FIELDS) {
      this.displayError(new Error(`Only ${this.$data.MAX_FILE_FIELDS} file fields allowed per upload!`));
      return false;
    }

    // tslint:disable-next-line:max-line-length
    // https://stackoverflow.com/questions/25016442/how-to-distinguish-if-a-file-or-folder-is-being-dragged-prior-to-it-being-droppe
    if (!files[0].type && !(files[0].size % 4096)) {
      this.displayError(new Error(`You can't upload folders!`));
      return false;
    }

    if (files[0].size > this.$data.MAX_FILE_SIZE * 1024 * 1024) {
      this.displayError(new Error(`${files[0].name} is too big!`));
      return false;
    }

    return true;
  }

  private displayConfirmation(title: string, description: string): void {
    const confirmationModal = this.modalGenerator.createConfirmation(title, description);
    this.$refs.modalContainer.appendChild(confirmationModal.$el);
  }

  private displayError(error: Error): void {
    const errorModal = this.modalGenerator.createError(error);
    this.$refs.modalContainer.appendChild(errorModal.$el);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.wrapper {
  position: absolute;
}

.uploadProgress {
  background-color: color("background");
}

.uploadProgressBar {
  background-color: color("blue");
}
</style>