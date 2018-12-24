import { Commit } from "vuex";
import State from "./State";

export default interface Action {
  commit: Commit;
  state: State;
}