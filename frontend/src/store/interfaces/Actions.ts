import { Commit, Dispatch } from "vuex";
import State from "@/store/interfaces/State";

export default interface Action {
  commit: Commit;
  dispatch: Dispatch;
  state: State;
}