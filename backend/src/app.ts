import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../process.env") });

import Request from "./interfaces/Request";
import express, { Application, Response, NextFunction } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import busboy from "connect-busboy";

// @ts-ignore Do not install @types/connect-mongo as it conflicts with mongoose's type defs
import connectMongo, { MongoStoreFactory } from "connect-mongo";
import { Mongoose } from "mongoose";
import { GridFSBucket } from "mongodb";

/* ROUTES */
import resolve from "./routes/resolve";
import upload from "./routes/upload";
import serveWebApp from "./routes/serverWebApp";

const MongoStore: MongoStoreFactory = connectMongo(session);

export default class Server {
  public readonly app: Application = express();

  private readonly COOKIE_SECRET: string | undefined = process.env.COOKIE_SECRET;
  private readonly MAX_FILE_SIZE: string | undefined = process.env.MAX_FILE_SIZE;
  private readonly MAX_FILES_PER_USER: string | undefined = process.env.MAX_FILES_PER_USER;

  private readonly mongoose: Mongoose;
  private readonly fileBucket: GridFSBucket;

  public constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.fileBucket = new GridFSBucket(this.mongoose.connection.db);
  }

  public initialize(): Application {
    this.checkConfiguration();
    this.loadMiddleware();
    this.loadRoutes();

    return this.app;
  }

  private checkConfiguration(): void | never {
    const message = (msg: string): string => `Expected a ${msg}, but received undefined instead`;

    if (!this.COOKIE_SECRET) throw new TypeError(message("string for cookie secret"));
    if (!this.MAX_FILE_SIZE) throw new TypeError(message("string of max file size in bytes"));
    if (!this.MAX_FILES_PER_USER) throw new TypeError(message("string for max number of files per user"));
  }

  private loadMiddleware(): void {
    this.app
      .use(express.static(path.join(__dirname, "../../frontend/dist/")))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(busboy({
        limits: {
          // fileSize: Number(this.MAX_FILE_SIZE)
        }
      }))
      .use(session({
        secret: this.COOKIE_SECRET,
        saveUninitialized: false, // don't create session until something stored
        resave: false, // don't save session if unmodified
        store: new MongoStore({
          mongooseConnection: this.mongoose.connection,
          ttl: 604800 // 7 days
        })
      }))
      .use((req: Request, res: Response, next: NextFunction): void => {
        req.mongoose = this.mongoose;
        req.fileBucket = this.fileBucket;

        next();
      });
  }

  private loadRoutes(): void {
    this.app
      .use("/resolve", resolve)
      .use("/upload", upload)
      .use(serveWebApp); // ALWAYS have to be the last route to prevent it from overriding other routes
  }
}