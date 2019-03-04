import Modal from "@/components/Modal.vue";

export default interface Buttons {
  [key: string]: (event: MouseEvent, modal: Modal) => void;
}
