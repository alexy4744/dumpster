// tslint:disable: no-var-requires

import path from "path";

require("module-alias/register");
// tslint:disable-next-line:newline-per-chained-call
require("dotenv").config({ path: path.join(__dirname, "../process.env") });

import fs from "fs";
import http from "http";
import https from "https";

import { Application } from "express";
import { MongoClient, Db } from "mongodb";

import App from "@structures/App";
import Console from "@structures/Console";

const console: Console = new Console();

connectToDatabase()
  .then((database: Db): Promise<void> => createServer(new App(database).initialize()))
  .catch(console.error);

async function connectToDatabase(): Promise<Db> {
  const MONGODB_ADDRESS: string = process.env.MONGODB_ADDRESS || "mongodb://localhost:27017";
  const MONGODB_DB_NAME: string = process.env.MONGODB_DB_NAME || "dumpster";

  try {
    const mongo: MongoClient = await MongoClient.connect(MONGODB_ADDRESS, { useNewUrlParser: true });
    const database: Db = mongo.db(MONGODB_DB_NAME);

    console.log(`[MONGODB] Connected to ${MONGODB_ADDRESS}!`);

    return Promise.resolve(database);
  } catch (error) {
    return Promise.reject(error);
  }
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
      process.env.HTTP,
      console.log.bind(this, `[EXPRESS] Started on port ${process.env.HTTP} (HTTP)`)
    );

  if (CERTIFICATES.key && CERTIFICATES.cert) {
    https
      .createServer(CERTIFICATES, app)
      .listen(
        process.env.HTTPS,
        console.log.bind(this, `[EXPRESS] Started on port ${process.env.HTTPS} (HTTPS)`)
      );
  }
}