import { Schema, model } from "mongoose";

const fileSchema: Schema = new Schema({
  name: String,
  uid: String,
  date: Date,
  chunk: Buffer
});

export default model("File", fileSchema);