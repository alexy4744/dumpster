import path from "path";

import express, {
  Application,
  Response,
  NextFunction
} from "express";
import session from "express-session";
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
    this.fileBucket = new GridFSBucket(this.mongoose.connection.db, {
      bucketName: process.env.MONGODB_DB_NAME || "dumpster"
    });
  }

  public initialize(): Application {
    this.checkConfiguration();
    this.loadMiddleware();
    this.loadRoutes();
    this.loadErrorHandler();

    return this.app;
  }

  private checkConfiguration(): void | never {
    const message = (msg: string): string => `Expected a ${msg}, but received undefined/null/NaN instead`;

    if (!this.COOKIE_SECRET) throw new TypeError(message("string for COOKIE_SECRET"));

    for (const Constant in Configuration) {
      if (Configuration[Constant] === null || Configuration[Constant] === undefined || isNaN(Configuration[Constant])) {
        throw new Error(message(`number for ${Constant}`));
      }
    }
  }

  private loadMiddleware(): void {
    this.app
      .use(helmet())
      .use(express.static(path.join(__dirname, "../../frontend/dist/")))
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
      .use("/upload", upload)
      .use(resolve)
      .use(serveWebApp); // ALWAYS have to be the last route to prevent it from overriding other routes
  }

  private loadErrorHandler(): void {
    /* Send the whole stack and log the error in the console if it is not in production mode */

    const isProduction = process.env.PRODUCTION === "true" ? true : false;

    this.app.use((error: Error, req: Request, res: Response): void => {
      res
        .status(500)
        .send(isProduction ? error.message : error.stack);

      if (isProduction) console.error(error);
    });
  }
}