import fs from "fs";
import http from "http";
import https from "https";

import dotenv from "dotenv";
import path from "path";

import app from "../app";

dotenv.config({ path: path.join(__dirname, "../process.env") });

const ports = {
  http: parseInt(process.env.HTTPS, null) || 80,
  https: parseInt(process.env.HTTPS, null) || 443
};

createServer();

async function createServer() {
  const certificates = {
    key: await fs.promises.readFile("../certs/cert.key").catch(() => null),
    cert: await fs.promises.readFile("../certs/cert.pem").catch(() => null)
  };

  http
    .createServer(app.callback())
    .listen(ports.http, () => process.stdout.write(`Server started on port ${ports.http} (HTTP)`));

  if (certificates.key && certificates.cert) {
    https
      .createServer(certificates, app.callback())
      .listen(ports.https, () => process.stdout.write(`Server started on port ${ports.https} (HTTPS)`));
  }
}