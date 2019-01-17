import { Console } from "console";
import { Writable } from "stream";

import chalk from "chalk";

interface ConsoleOptions {
  stdout?: Writable;
  stderr?: Writable;
  ignoreErrors?: boolean;
  colorMode?: boolean | string;
}

export default class DumpsterConsole extends Console {
  constructor(options?: ConsoleOptions) {
    super({
      stdout: options ? options.stdout || process.stdout : process.stdout,
      stderr: options ? options.stderr || process.stderr : process.stderr
    });
  }

  public log(...args: any) {
    super.log(chalk.blue(this.prettyTimeStamp), ...args);
  }

  public error(error: Error | string) {
    super.error(chalk.red(`${this.prettyTimeStamp} ${error instanceof Error ? error.message : error}`));
  }

  private get prettyTimeStamp() {
    const date = new Date(Date.now());

    return `[${date.toLocaleTimeString()} ${date.toLocaleDateString()}]`;
  }
}