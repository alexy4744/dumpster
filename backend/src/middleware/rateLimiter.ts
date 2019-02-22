import {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";

import {
  RateLimiterMongo,
  IRateLimiterStoreOptions
} from "rate-limiter-flexible";

export default (options: IRateLimiterStoreOptions): RequestHandler => {
  const rateLimiter: RateLimiterMongo = new RateLimiterMongo({
    ...options,
    // tslint:disable-next-line: max-line-length
    // https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#apply-in-memory-block-strategy-for-better-protection
    inmemoryBlockOnConsumed: Number(options.points) + 1,
    inmemoryBlockDuration: options.duration
  });

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.connection.remoteAddress) return;

    rateLimiter
      .consume(req.connection.remoteAddress)
      .then(() => next())
      .catch(() => {
        res.status(429).send("Too Many Requests");
      });
  };
};