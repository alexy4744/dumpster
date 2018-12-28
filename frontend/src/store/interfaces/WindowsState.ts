import Window from "@/components/Desktop/Window.vue";

export default interface WindowsState {
  windows: Map<string, Window>;
  totalWindows: number;
}