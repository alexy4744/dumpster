import fs from 'fs';
import path from 'path';

import koaBody from 'koa-body';
import koaSend from 'koa-send';

import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

const koaBodyOptions = {
  multipart: true,
  formidable: {
    hash: 'sha1',
    keepExtensions: true
  }
};

router.post('/upload', koaBody(koaBodyOptions), (ctx) => {

});

router.get('*', async (ctx) => {
  const file = path.join(__dirname, '../../frontend/dist/index.html');

  try {
    await fs.promises.stat(file);
    await koaSend(ctx, file);
  } catch (error) {
    ctx.body = error;
  }
});

app.use(router.routes());

export default app;