import Application from "@/components/Desktop/Application.vue";

export default interface WindowsState {
  windows: Map<string, Application>;
  totalWindows: number;
}