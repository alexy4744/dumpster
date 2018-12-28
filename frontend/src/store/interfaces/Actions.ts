import { Commit } from "vuex";
import State from "./WindowsState";

export default interface Action {
  commit: Commit;
  state: State;
}