import Actions from "../../interfaces/Actions";
import Window from "@/components/Desktop/Window.vue";

/* First param is "context", but destructued, so context.commit, context.state => commit, state */
export default {
  newWindow({ commit }: Actions, window: Window) {
    commit("createNewWindow", window);
  },

  close({ commit }: Actions, windowId: string) {
    commit("removeWindow", windowId);
  },

  closeAll({ commit }: Actions) {
    commit("removeAllWindows");
  }
};