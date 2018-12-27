import { promises } from "fs";
import path from "path";
import dotenv from "dotenv";

import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import busboy from "busboy";

import MongoDB from "./database/MongoDB";

dotenv.config({ path: path.join(__dirname, "../process.env") });

const app = express();
const MongoStore = require("connect-mongo")(session);

app.use(async () => {
  try {
    const url: string = process.env.MONGODB || "mongodb://localhost:27017";
    const database: MongoDB = await MongoDB.initialize({
      url,
      dbName: "dumpster"
    })

    return session({
      secret: "123456",
      saveUninitialized: false, // don't create session until something stored
      resave: false, // don't save session if unmodified
      store: new MongoStore({
        db: database.connection,
        ttl: 604800 // 7 days
      })
    })
  } catch (error) {
    throw error;
  }
})

app.get("*", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const file = path.join(__dirname, "../../frontend/dist/index.html");

  try {
    await promises.stat(file); // If this doesn't throw an error, then the file exists.
    res.sendFile(file)
  } catch (error) { // Else toss the error to the error handler
    next();
  }
});

// Error handler here...

export default app;