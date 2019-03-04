export default interface File {
  _id: string;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  md5: string;
  contentType: string;
  metadata: {
    [key: string]: any;
  };
}
