import express, {
  Application,
  Request,
  Response,
  NextFunction
} from "express";

import {
  Db,
  GridFSBucket,
  MongoClient
} from "mongodb";

import helmet from "helmet";

import enableCORS from "@middleware/enableCORS";
import rateLimiter from "@middleware/rateLimiter";

import IRequest from "@interfaces/IRequest";

import download from "@routes/download";
import resolve from "@routes/resolve";
import upload from "@routes/upload";

import Console from "@structures/Console";

const console: Console = new Console();

class Server {
  private readonly app: Application = express();
  private readonly bucket: GridFSBucket;
  private readonly dumpsterDatabase: Db;
  private readonly mongoConnection: MongoClient;
  private readonly isProduction: boolean = process.env.NODE_ENV === "production" ? true : false;

  public constructor(connection: MongoClient) {
    this.mongoConnection = connection;
    this.dumpsterDatabase = this.mongoConnection.db(process.env.MONGODB_DB_NAME || "dumpster");
    this.bucket = new GridFSBucket(this.dumpsterDatabase);
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
      .use(enableCORS)
      .use((req: Request, res: Response, next: NextFunction): void => {
        // Appends bucket to the request object so that the bucket can be accessed by req.bucket in routes
        (req as IRequest).bucket = this.bucket;
        next();
      });

    return this.app;
  }

  public loadRoutes(): Application {
    this.app.get("/download/:id", rateLimiter({
      storeClient: this.mongoConnection,
      keyPrefix: "download",
      tableName: "download",
      points: Number(process.env.RATELIMIT_DOWNLOAD_POINTS),
      duration: Number(process.env.RATELIMIT_DOWNLOAD_DURATION) * 60
    }), download);

    this.app.post("/upload", rateLimiter({
      storeClient: this.mongoConnection,
      keyPrefix: "upload",
      tableName: "upload",
      points: Number(process.env.RATELIMIT_UPLOAD_POINTS),
      duration: Number(process.env.RATELIMIT_UPLOAD_DURATION) * 60
    }), upload);

    /* Ratelimiter for basic request like /resolve */
    this.app.use(rateLimiter({
      storeClient: this.mongoConnection,
      keyPrefix: "basic",
      tableName: "basic",
      points: Number(process.env.RATELIMIT_BASIC_POINTS),
      duration: Number(process.env.RATELIMIT_BASIC_DURATION) * 60
    }));

    /* Any route below here will be rate limited by the basic ratelimiter */
    this.app.get("/resolve/:id", resolve);

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