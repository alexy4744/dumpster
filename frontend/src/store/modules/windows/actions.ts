import Actions from "../../interfaces/Actions";
import Application from "@/components/Desktop/Application.vue";

/* First param is "context", but destructued, so context.commit, context.state => commit, state */
export default {
  addWindow({ commit, state }: Actions, window: Application) {
    commit("createNewWindow", window);
  },

  close({ commit }: Actions, windowId: string) {
    commit("removeWindow", windowId);
  },

  closeAll({ commit }: Actions) {
    commit("removeAllWindows");
  }
};