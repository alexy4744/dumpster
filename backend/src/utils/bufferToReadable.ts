/* Wrap a buffer as a readable stream
  https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-nodejs */

import { Readable } from "stream";

export default (buffer: Buffer): Readable => {
  const readableStream: Readable = new Readable(); // Create a new readable stream with no data

  readableStream.push(buffer); // Put the buffer into the readable stream
  readableStream.push(null);  // Must push null at the end to indicate that it is finished outputting data

  return readableStream;
};