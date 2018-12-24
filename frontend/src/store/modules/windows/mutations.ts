import State from "../../interfaces/State";
import Window from "@/components/Desktop/Window.vue";

export default {
  createNewWindow(state: State, window: Window): void {
    state.windows.set(state.totalWindows, window);
    state.totalWindows++;
  },

  removeWindow(state: State, windowId: number): void {
    state.windows.delete(windowId);
    state.totalWindows--;
  },

  removeAllWindows(state: State): void {
    for (const window of state.windows) {
      state.windows.delete(window[0]);
    }

    state.totalWindows = 0;
  }
};
