import WindowsState from "../../interfaces/WindowsState";
import Window from "@/components/Desktop/Window.vue";

export default {
  createNewWindow(state: WindowsState, window: Window): void {
    state.windows.set(String(state.totalWindows), window);
    state.totalWindows++;
  },

  removeWindow(state: WindowsState, windowId: string): void {
    state.windows.delete(windowId);
    state.totalWindows--;
  },

  removeAllWindows(state: WindowsState): void {
    for (const window of state.windows) {
      state.windows.delete(window[0]);
    }

    state.totalWindows = 0;
  }
};
