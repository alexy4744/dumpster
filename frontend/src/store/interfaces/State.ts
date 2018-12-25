import Window from "@/components/Desktop/Window.vue";

export default interface State {
  windows: Map<string, Window>;
  totalWindows: number;
}