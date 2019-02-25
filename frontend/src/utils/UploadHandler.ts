import EventEmitter from "events";
import superagent, { Request, Response, ProgressEvent } from "superagent";

import { BACKEND_URL } from "@/../../config.json";

export default class UploadHandler extends EventEmitter {
  public currentUpload: Request | null = null;

  public upload(formData: FormData): Promise<Response> {
    return new Promise<Response>(
      (resolve, reject): void => {
        if (this.currentUpload) {
          return reject(new Error("There is already an ongoing request while attempting to start a new one!`"));
        }

        this.currentUpload = superagent
          .post(`${BACKEND_URL}/upload/`)
          .send(formData)
          .on("progress", (event: ProgressEvent): boolean => this.emit("progress", event));

        this.currentUpload
          .then(
            (res: Response): void => {
              this.currentUpload = null;
              resolve(res);
            }
          )
          .catch(
            (error: Error): void => {
              this.currentUpload = null;
              reject(error);
            }
          );
      }
    );
  }

  public abortCurrentUpload(): Promise<UploadHandler> {
    if (!this.currentUpload) {
      return Promise.reject(new Error("There is no ongoing requests to abort!"));
    }

    this.currentUpload.abort();
    this.currentUpload = null;

    return Promise.resolve(this);
  }
}
