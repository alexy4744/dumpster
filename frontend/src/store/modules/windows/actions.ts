import Actions from "../../interfaces/Actions";
import Window from "@/components/Desktop/Window.vue";

/* First param is "context", but destructued, so context.commit, context.state => commit, state */
export default {
  newWindow({ commit, state }: Actions, window: Window) {
    commit("createNewWindow", window);
  },

  close({ commit, state }: Actions, windowId: number) {
    commit("removeWindow", windowId);
  },

  closeAll({ commit, state }: Actions) {
    commit("removeAllWindows");
  }
};