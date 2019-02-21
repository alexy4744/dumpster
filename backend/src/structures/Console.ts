/* Drop in replacement for console, might add logging */

import ConsoleOptions from "@interfaces/ConsoleOptions";

import { Console } from "console";
import chalk from "chalk";

export default class extends Console {
  public constructor(options?: ConsoleOptions) {
    super({
      stdout: options && options.stdout ? options.stdout : process.stdout,
      stderr: options && options.stderr ? options.stderr : process.stderr
    });
  }

  private get prettyTimeStamp(): string {
    const date: Date = new Date(Date.now());

    return `[${date.toLocaleTimeString()} ${date.toLocaleDateString()}]`;
  }

  public log(...args: any): void {
    super.log(chalk.blue(this.prettyTimeStamp), ...args);
  }

  public error(error: Error | string): void {
    super.error(chalk.red(`${this.prettyTimeStamp} ${error}`));
  }
}