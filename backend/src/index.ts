// tslint:disable-next-line: no-var-requires
require("module-alias/register");

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../process.env") });

import fs from "fs";
import http from "http";
import https from "https";

import { Application } from "express";
import { MongoClient, Db } from "mongodb";

import Server from "@structures/Server";
import Console from "@structures/Console";

const console: Console = new Console();

connectToDatabase()
  .then((database: Db): void => {
    const app: Application = new Server(database)
      .initialize()
      .express();

    createServer(app);
  })
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
  if (!process.env.HTTP) return console.error("No HTTP port specified in process.env!");

  http
    .createServer(app)
    .listen(process.env.HTTP, () => console.log(`[EXPRESS] Started on port ${process.env.HTTP} (HTTP)`));

  if (!process.env.HTTPS) return;

  const certificates: {
    [key: string]: Buffer | null
  } = {
    key: await fs.promises
      .readFile("../certs/cert.key")
      .catch((): null => null),

    cert: await fs.promises
      .readFile("../certs/cert.pem")
      .catch((): null => null)
  };

  if (certificates.key && certificates.cert) {
    https
      .createServer(certificates, app)
      .listen(process.env.HTTPS, () => console.log(`[EXPRESS] Started on port ${process.env.HTTPS} (HTTPS)`));
  }
}