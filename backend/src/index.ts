// tslint:disable: no-var-requires
require("module-alias/register");

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

// tslint:disable-next-line: newline-per-chained-call
const dotenv = require("dotenv").config({ path: path.join(__dirname, "../process.env") });

import { Application } from "express";
import mongoose, { Mongoose } from "mongoose";

import App from "@structures/App";
import Console from "@structures/Console";
import Configuration from "@structures/Configuration";

const console: Console = new Console();

checkConfiguration();
connectToDatabase()
  .then((database: Mongoose): Promise<void> => createServer(new App(database).initialize()))
  .catch(console.error);

function checkConfiguration(): void | never {
  const message = (msg: string): string => `Expected a ${msg}, but received undefined/null/NaN instead`;

  if (!dotenv.parsed.COOKIE_SECRET) throw new TypeError(message("string for COOKIE_SECRET"));

  for (const Constant in Configuration) {
    if (Configuration[Constant] === null || Configuration[Constant] === undefined || isNaN(Configuration[Constant])) {
      throw new Error(message(`number for ${Constant}`));
    }
  }
}

async function connectToDatabase(): Promise<Mongoose> {
  const MONGODB_ADDRESS: string = process.env.MONGODB_ADDRESS || "mongodb://localhost:27017";
  const MONGODB_DB_NAME: string = process.env.MONGODB_DB_NAME || "dumpster";

  return new Promise((resolve, reject): void => {
    mongoose.connection.on("open", console.log.bind(this, `[MONGOOSE] Connected to ${MONGODB_ADDRESS}!`));
    mongoose.connection.on("error", console.error);

    mongoose.connect(MONGODB_ADDRESS, {
      dbName: MONGODB_DB_NAME,
      useNewUrlParser: true
    }, (error: Error): void => {
      if (error) return reject(error);
      resolve(mongoose);
    });
  });
}

async function createServer(app: Application): Promise<void> {
  const CERTIFICATES: { [key: string]: Buffer | null } = {
    key: await fs.promises
      .readFile("../certs/cert.key")
      .catch((): null => null),

    cert: await fs.promises
      .readFile("../certs/cert.pem")
      .catch((): null => null)
  };

  http
    .createServer(app)
    .listen(
      Configuration.HTTP_PORT,
      console.log.bind(this, `Server started on port ${Configuration.HTTP_PORT} (HTTP)`)
    );

  if (CERTIFICATES.key && CERTIFICATES.cert) {
    https
      .createServer(CERTIFICATES, app)
      .listen(
        Configuration.HTTPS_PORT,
        console.log.bind(this, `Server started on port ${Configuration.HTTPS_PORT} (HTTPS)`)
      );
  }
}