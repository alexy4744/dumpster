import crypto from "crypto";

export default (size: number): Promise<string> => {
  return new Promise<string>((resolve, reject): void => {
    crypto.randomBytes(size, (error: Error | null, buffer: Buffer): void => {
      if (error) return reject(error);
      resolve(buffer.toString("hex"));
    });
  });
};