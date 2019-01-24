import { Writable } from "stream";

export default interface ConsoleOptions {
  stdout?: Writable;
  stderr?: Writable;
  ignoreErrors?: boolean;
  colorMode?: boolean | string;
}