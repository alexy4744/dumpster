import path from "path";

import express, { Application } from "express";
import session from "express-session";
import bodyParser from "body-parser";

// @ts-ignore Do not install @types/connect-mongo as it conflicts with mongoose's type defs
import connectMongo, { MongoStoreFactory } from "connect-mongo";
import { Connection } from "mongoose";

/* ROUTES */
import serveWebApp from "./routes/serverWebApp";

const MongoStore: MongoStoreFactory = connectMongo(session);

export default class DumpsterServer {
  public app: Application = express();

  private readonly COOKIE_SECRET: string | undefined = process.env.COOKIE_SECRET;

  private readonly database: Connection;

  constructor(databaseConnection: Connection) {
    this.database = databaseConnection;
  }

  public initialize() {
    this.checkConstants();
    this.loadMiddleware();
    this.loadRoutes();

    return this.app;
  }

  private checkConstants() {
    if (!this.COOKIE_SECRET) throw new TypeError("Expected a string for cookie secret, received undefined instead.");
  }

  private loadMiddleware() {
    this.app
      .use(express.static(path.join(__dirname, "../../frontend/dist/")))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(session({
        secret: this.COOKIE_SECRET,
        saveUninitialized: false, // don't create session until something stored
        resave: false, // don't save session if unmodified
        store: new MongoStore({
          mongooseConnection: this.database,
          ttl: 604800 // 7 days
        })
      }));
  }

  private async loadRoutes() {
    this.app
      .use("*", serveWebApp); // ALWAYS have to be the last route to prevent it from overriding other routes
  }
}