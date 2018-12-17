import MongoDB from "./MongoDB";

class MongoStore {
  public readonly mongo: MongoDB;

  constructor(mongo: MongoDB) {
    this.mongo = mongo;
  }

  public async get(id: string, ageMax: number, { rolling }: any) {
    return this.mongo.get(this.mongo.dbName, id);
  }

  public set(key: string, session: any, maxAge: number, { rolling, changed }: any) {
    return this.mongo.insert(this.mongo.dbName, {
      _id: key,
      maxAge,
      session
    });
  }

  public destroy(key: string) {
    return this.mongo.delete(this.mongo.dbName, key);
  }
}

export default MongoStore;