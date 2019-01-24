import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

require("module-alias/register"); // tslint:disable-line
require("dotenv").config({ path: path.join(__dirname, "../process.env") }); // tslint:disable-line

import { Application } from "express";
import mongoose, { Mongoose } from "mongoose";

import App from "@/app";
import Console from "@structures/Console";
import Configuration from "@structures/Configuration";

const console: Console = new Console();

connectToDatabase()
  .then((database: Mongoose): Promise<void> => createServer(new App(database).initialize()))
  .catch(console.error);

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