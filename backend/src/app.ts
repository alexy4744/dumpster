import fs from "fs";
import path from "path";

import koaBody from "koa-body";
import koaSend from "koa-send";
import koaSession from "koa-session";

import Koa from "koa";
import Router from "koa-router";

import MongoDB from "./store/MongoDB";
import MongoStore from "./store/MongoStore";

import upload from "./api/upload";
import paste from "./api/paste";

const app = new Koa();
const router = new Router();


// First check if its an API request
router.post("/api/upload", koaBody({
  multipart: true,
  formidable: {
    hash: "sha1",
    keepExtensions: true
  }
}), (ctx) => upload(ctx));

router.post("/api/paste", koaBody(), (ctx) => paste(ctx));

// If its not, then just load the web app
router.get("*", async (ctx) => {
  const file = path.join(__dirname, "../../frontend/dist/index.html");

  try {
    await fs.promises.stat(file);
    await koaSend(ctx, file);
  } catch (error) {
    ctx.body = error;
  }
});

app.use(async () => {
  try {
    const database = await MongoDB.initialize({
      url: "mongodb://localhost:27017",
      dbName: "dumpster"
    });

    const store = new MongoStore(database);

    return koaSession({ store }, app);
  } catch (error) {
    throw error;
  }
});

app.use(router.routes());

export default app;