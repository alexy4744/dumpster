import mongoose, {
  Connection,
  ConnectionOptions
} from "mongoose";

import Console from "../structures/Console";

const console: Console = new Console();

export default class Mongoose {
  public connection: Connection | null = null;

  public connect(url: string, options: ConnectionOptions = {}): Promise<Connection> {
    return new Promise((resolve, reject): void => {
      mongoose.connection.on("open", console.log.bind(this, `[MONGOOSE] Connected to ${url}!`));
      mongoose.connection.on("error", console.error.bind(this));

      mongoose.connect(url, options, (error: Error): void => {
        if (error) return reject(error);
        this.connection = mongoose.connection;
        resolve(this.connection);
      });
    });
  }
}