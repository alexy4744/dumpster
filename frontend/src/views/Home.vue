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
        v-if="uploadHandler.currentUpload"
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
import UploadHandler from "@/utils/UploadHandler";

import { VNode } from "vue";
import { Component, Vue } from "vue-property-decorator";
import superagent, { Response, ProgressEvent } from "superagent";

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

  private readonly uploadHandler: UploadHandler = new UploadHandler();
  private readonly modalGenerator: ModalGenerator = new ModalGenerator(this);

  public mounted(): void {
    const fileId: string = this.$route.params.id;
    if (fileId) this.displayFile(fileId);

    this.$refs.dropZone.ondragover = (event: DragEvent): void => {
      event.preventDefault();
    };

    this.$refs.dropZone.ondrop = (event: DragEvent): void => {
      event.preventDefault();
      this.dropHandler(event);
    };

    this.uploadHandler.on("progress", this.handleUploadProgress);
  }

  private uploadPaste(): void {
    const currentText: string = this.$refs.codeflask.$refs.input.value;

    // If no text or the welcome message is still shown, don't upload
    if (!currentText.length || this.$refs.codeflask.welcomeIsDisplayed) {
      this.displayError(new Error("There is no paste to be uploaded!"));
      return;
    }

    const paste: Blob = new Blob([currentText], { type: "text/plain" });
    const formData: FormData = new FormData();

    formData.append("", paste, `${new Date().toLocaleTimeString()}.txt`);

    this.uploadFiles(formData);
  }

  private uploadFiles(formData: FormData): void {
    this.uploadHandler
      .upload(formData)
      .then(this.onUploadFinish)
      .catch(this.displayError);
  }

  private cancelUpload(): void {
    this.uploadHandler.abortCurrentUpload().catch(this.displayError);
  }

  private handleUploadProgress(event: ProgressEvent): void {
    if (!event.percent) return;
    if (!this.$refs.uploadModal || !this.$refs.uploadProgressBar) return;

    this.$refs.uploadProgressBar.setProgress(event.percent);
  }

  private onUploadFinish(res: Response): void {
    // NEED TO BE MADE TO WORK WITH MULTIPLE FILES
    // const id: string = res.body.data.items[0];
    // const filename: string = res.body.originalname;
    // if (!id) {
    //   this.displayError(
    //     new Error(`Failed to retrieve a unique ID back from the server!`)
    //   );
    //   return;
    // }
    // const newUrl: string = this.$data.BACKEND_URL + "/resolve/" + id;
    // if (history.pushState) window.history.pushState({}, "Dumpster", newUrl);
    // else window.location.href = newUrl;
    // this.displayConfirmation(
    //   "File Uploaded!",
    //   `You can use ${newUrl} to share ${filename}!`
    // );
  }

  private dropHandler(event: DragEvent): void {
    const files: FileList | null = event.dataTransfer
      ? event.dataTransfer.files
      : null;

    if (!files) {
      this.displayError(
        new Error(`No files were found during the drag and drop!`)
      );
      return;
    }

    if (!this.validateFiles(files)) return;

    const formData: FormData = new FormData();

    for (let i: number = 0; i < files.length; i++) {
      formData.append("", files[i]);
    }

    this.uploadFiles(formData);
  }

  private validateFiles(files: FileList): boolean {
    if (files.length > this.$data.MAX_FIELDS) {
      this.displayError(
        new Error(`You cannot upload more than ${this.$data.MAX_FIELDS} files!`)
      );

      return false;
    }

    for (let i: number = 0; i < files.length; i++) {
      // tslint:disable-next-line:max-line-length
      // https://stackoverflow.com/questions/25016442/how-to-distinguish-if-a-file-or-folder-is-being-dragged-prior-to-it-being-droppe
      if (!files[i].type && !(files[i].size % 4096)) {
        this.displayError(new Error("You can't upload folders!"));
        return false;
      }

      if (files[i].size > this.$data.MAX_FILE_SIZE * 1024 * 1024) {
        this.displayError(new Error(`${files[i].name} is too big!`));
        return false;
      }
    }

    return true;
  }

  private displayFile(id: string): void {
    const url: string = this.$data.BACKEND_URL + "/download/" + id;

    superagent
      .get(url)
      .then(
        (res: Response): void => {
          if (res.type === "text/plain") {
            setTimeout(
              (): void => {
                this.$refs.codeflask.hideWelcome();
                this.$refs.codeflask.insertText(res.text);
                this.$refs.codeflask.highlight();
              }
            );
          } else {
            // display download modal
          }
        }
      )
      .catch(this.displayError);
  }

  private displayConfirmation(title: string, description: string): void {
    const confirmationModal: Modal = this.modalGenerator.createConfirmation(
      title,
      description
    );
    this.$refs.modalContainer.appendChild(confirmationModal.$el);
  }

  private displayError(error: Error): void {
    const errorModal: Modal = this.modalGenerator.createError(error);
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