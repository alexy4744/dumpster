// tslint:disable-next-line: no-var-requires
require("module-alias/register");

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../process.env") });

import fs from "fs";
import http from "http";
import https from "https";

import { Application } from "express";
import { MongoClient } from "mongodb";

import Server from "@structures/Server";
import Console from "@structures/Console";

import checkConfiguration from "@utils/checkConfiguration";
import readFile from "@utils/readFile";

if (!checkConfiguration()) process.exit(1);

const console: Console = new Console();

connectToDatabase()
  .then(
    (databaseConnection: MongoClient): void => {
      const app: Application = new Server(databaseConnection)
        .initialize()
        .express();

      createServer(app);
    }
  )
  .catch(console.error);

async function connectToDatabase(): Promise<MongoClient> {
  const MONGODB_ADDRESS: string =
    process.env.MONGODB_ADDRESS || "mongodb://localhost:27017";

  try {
    const mongo: MongoClient = await MongoClient.connect(MONGODB_ADDRESS, {
      useNewUrlParser: true
    });

    console.log(`[MONGODB] Connected to ${MONGODB_ADDRESS}!`);

    return Promise.resolve(mongo);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function createServer(app: Application): Promise<void> {
  http
    .createServer(app)
    .listen(process.env.HTTP, () =>
      console.log(`[EXPRESS] Started on port ${process.env.HTTP} (HTTP)`)
    );

  if (!process.env.HTTPS) return;

  const certificates: {
    [key: string]: Buffer | null;
  } = {
    key: await readFile(path.join(__dirname, "../certs/cert.key")).catch(
      (): null => null
    ),
    cert: await readFile(path.join(__dirname, "../certs/cert.pem")).catch(
      (): null => null
    )
  };

  if (certificates.key && certificates.cert) {
    https
      .createServer(certificates, app)
      .listen(process.env.HTTPS, () =>
        console.log(`[EXPRESS] Started on port ${process.env.HTTPS} (HTTPS)`)
      );
  }
}
