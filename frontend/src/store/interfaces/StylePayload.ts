import Payload from "@/store/interfaces/Payload";

export default interface StylePayload extends Payload {
  value: string;
  reference: string;
}