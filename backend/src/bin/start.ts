import fs from "fs";
import http from "http";
import https from "https";

import dotenv from "dotenv";
import path from "path";

import { Application } from "express";
import mongoose, { Mongoose } from "mongoose";

import App from "../app";
import Console from "../structures/Console";

dotenv.config({ path: path.join(__dirname, "../process.env") });

const MONGODB_ADDRESS: string = process.env.MONGODB || "mongodb://localhost:27017";
const MONGODB_DB_NAME: string = "dumpster";

const PORTS: { [key: string]: number } = {
  http: parseInt(process.env.HTTP, null) || 80,
  https: parseInt(process.env.HTTPS, null) || 443
};

const console: Console = new Console();

start();

async function start(): Promise<void> {
  const database: Mongoose = await connectToDatabase();
  const app: Application = new App(database).initialize();
  createServer(app);
}

async function connectToDatabase(): Promise<Mongoose> {
  return new Promise((resolve, reject): void => {
    mongoose.connection.on("open", console.log.bind(this, `[MONGOOSE] Connected to ${MONGODB_ADDRESS}!`));
    mongoose.connection.on("error", console.error.bind(this));

    mongoose.connect(MONGODB_ADDRESS, {
      dbName: MONGODB_DB_NAME
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
    .listen(PORTS.http, console.log.bind(this, `Server started on port ${PORTS.http} (HTTP)\n`));

  if (CERTIFICATES.key && CERTIFICATES.cert) {
    https
      .createServer(CERTIFICATES, app)
      .listen(PORTS.https, console.log.bind(this, `Server started on port ${PORTS.https} (HTTPS)\n`));
  }
}