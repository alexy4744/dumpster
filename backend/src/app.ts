import path from "path";

import express, {
  Application,
  Response,
  NextFunction
} from "express";
import session from "express-session";
import bodyParser from "body-parser";
import Request from "@interfaces/Request";

import helmet from "helmet";

// @ts-ignore Do not install @types/connect-mongo as it conflicts with mongoose's type defs
import connectMongo, { MongoStoreFactory } from "connect-mongo";
import { Mongoose } from "mongoose";
import { GridFSBucket } from "mongodb";

/* ROUTES */
import resolve from "@routes/resolve";
import upload from "@routes/upload";
import serveWebApp from "@routes/serverWebApp";

import Configuration from "@/structures/Configuration";

const MongoStore: MongoStoreFactory = connectMongo(session);

export default class Server {
  public readonly app: Application = express();

  private readonly COOKIE_SECRET: string | undefined = process.env.COOKIE_SECRET;

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
    const message = (msg: string): string => `Expected a ${msg}, but received undefined or null instead`;

    if (!this.COOKIE_SECRET) throw new TypeError(message("string for cookie secret"));

    for (const constant in Configuration) {
      if (constant === null || constant === undefined) {
        throw new TypeError(message(`a value for ${constant}`));
      }
    }
  }

  private loadMiddleware(): void {
    this.app
      .use(helmet())
      .use(express.static(path.join(__dirname, "../../frontend/dist/")))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(session({
        secret: this.COOKIE_SECRET,
        saveUninitialized: false, // don't create session until something stored
        resave: false, // don't save session if unmodified
        store: new MongoStore({
          mongooseConnection: this.mongoose.connection,
          ttl: Configuration.SESSION_TTL
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