import path from "path";

import express, {
  Application,
  Response,
  NextFunction
} from "express";
import session from "express-session";
import Request from "@interfaces/Request";

import helmet from "helmet";
import bodyParser from "body-parser";

// @ts-ignore Do not install @types/connect-mongo as it conflicts with mongoose's type defs
import connectMongo, { MongoStoreFactory } from "connect-mongo";
import { GridFSBucket, Db } from "mongodb";

/* MIDDLEWARE */
import allowCORS from "@middleware/allowCORS";

/* ROUTES */
import resolve from "@routes/resolve";
import upload from "@routes/upload";
import serveWebApp from "@routes/serverWebApp";

// tslint:disable-next-line: no-var-requires
const Configuration = require("@/../../config.json");
const MongoStore: MongoStoreFactory = connectMongo(session);

export default class App {
  public readonly app: Application = express();
  public readonly isProduction: boolean;

  private readonly database: Db;
  private readonly fileBucket: GridFSBucket;

  public constructor(database: Db) {
    this.isProduction = process.env.NODE_ENV === "production" ? true : false;

    this.database = database;
    this.fileBucket = new GridFSBucket(this.database, {
      bucketName: process.env.MONGODB_DB_NAME || "dumpster"
    });
  }

  public initialize(): Application {
    this.loadMiddleware();
    this.loadRoutes();
    this.loadErrorHandler();

    return this.app;
  }

  private loadMiddleware(): void {
    this.app
      .use(helmet())
      .use(allowCORS)
      .use(express.static(path.join(__dirname, "../../../frontend/dist/")))
      .use(bodyParser.json({ limit: Configuration.MAX_PASTE_SIZE * 1024 * 1024 }))
      .use(session({
        secret: process.env.COOKIE_SECRET,
        saveUninitialized: false, // don't create session until something stored
        resave: false, // don't save session if unmodified
        store: new MongoStore({
          db: this.database,
          ttl: process.env.SESSION_TTL
        })
      }))
      .use((req: Request, res: Response, next: NextFunction): void => {
        req.database = this.database;
        req.fileBucket = this.fileBucket;
        req.isProduction = this.isProduction;

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
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
      res
        .status(500)
        .send({
          message: this.isProduction ? error.message : error.stack
        });

      if (!this.isProduction) console.error(error);
    });
  }
}