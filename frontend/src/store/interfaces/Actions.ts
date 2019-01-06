import { Commit, Dispatch } from "vuex";
import State from "./WindowsState";

export default interface Action {
  commit: Commit;
  dispatch: Dispatch;
  state: State;
}