import fs from "fs";
import http from "http";
import https from "https";

import dotenv from "dotenv";
import path from "path";

import { Application } from "express";

import Mongoose from "../database/Mongoose";
import { Connection } from "mongoose";

import App from "../app";

dotenv.config({ path: path.join(__dirname, "../process.env") });

const MONGODB_ADDRESS: string = process.env.MONGODB || "mongodb://localhost:27017";
const MONGODB_DB_NAME: string = "dumpster";

const PORTS: { [key: string]: number } = {
  http: parseInt(process.env.HTTPS, null) || 80,
  https: parseInt(process.env.HTTPS, null) || 443
};

const mongoose: Mongoose = new Mongoose();

start();

async function start(): Promise<void> {
  const databaseConnection = await connectToDatabase();
  const app: Application = new App(databaseConnection).initialize();
  createServer(app);
}

async function connectToDatabase(): Promise<Connection> {
  const connection: Connection = await mongoose.connect(MONGODB_ADDRESS, {
    dbName: MONGODB_DB_NAME
  });

  return connection;
}

async function createServer(app: Application): Promise<void> {
  const CERTIFICATES: { [key: string]: Buffer | null } = {
    key: await fs.promises
      .readFile("../certs/cert.key")
      .catch(() => null),
    cert: await fs.promises
      .readFile("../certs/cert.pem")
      .catch(() => null)
  };

  http
    .createServer(app)
    .listen(PORTS.http, () => process.stdout.write(`Server started on port ${PORTS.http} (HTTP)\n`));

  if (CERTIFICATES.key && CERTIFICATES.cert) {
    https
      .createServer(CERTIFICATES, app)
      .listen(PORTS.https, () => process.stdout.write(`Server started on port ${PORTS.https} (HTTPS)\n`));
  }
}