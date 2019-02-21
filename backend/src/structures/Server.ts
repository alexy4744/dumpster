import express, {
  Application,
  Request,
  Response,
  NextFunction
} from "express";
import { Db, GridFSBucket } from "mongodb";

import helmet from "helmet";

import IRequest from "@interfaces/IRequest";

import download from "@routes/download";
import resolve from "@routes/resolve";
import upload from "@routes/upload";

import Console from "@structures/Console";

const console: Console = new Console();

class Server {
  private readonly app: Application = express();
  private readonly bucket: GridFSBucket;
  private readonly database: Db;
  private readonly isProduction: boolean = process.env.NODE_ENV === "production" ? true : false;

  public constructor(database: Db) {
    this.database = database;
    this.bucket = new GridFSBucket(this.database, {
      bucketName: process.env.MONGODB_BUCKET_NAME || "dumpster"
    });
  }

  public express(): Application {
    return this.app;
  }

  public initialize(): Server {
    this.loadMiddleware();
    this.loadRoutes();
    this.loadErrorHandler();

    return this;
  }

  public loadMiddleware(): Application {
    this.app
      .use(helmet())
      .use((req: Request, res: Response, next: NextFunction): void => {
        (req as IRequest).bucket = this.bucket;
        next();
      });

    return this.app;
  }

  public loadRoutes(): Application {
    this.app
      .use(download)
      .use(upload)
      .use(resolve);

    return this.app;
  }

  public loadErrorHandler(): Application {
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
      res.json({
        error: {
          message: error.message,
          stack: !this.isProduction ? error.stack : null
        }
      });

      if (!this.isProduction) console.error(error);
    });

    return this.app;
  }
}

export default Server;