import {
  Collection,
  Db,
  MongoClient,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  UpdateWriteOpResult
} from "mongodb";

interface ConnectOptions {
  url: string;
  dbName: string;
}

interface Document {
  _id: string;
  maxAge: number;
  session: any;
}

class MongoDB {
  public static async initialize(options: ConnectOptions): Promise<MongoDB> {
    const self = new MongoDB();
    await self.connect(options);
    return self;
  }

  public connection: Db;
  public dbName: string;

  public async connect(options: ConnectOptions): Promise<Db> {
    try {
      const connection: MongoClient = await MongoClient.connect(options.url, { useNewUrlParser: true });

      this.dbName = options.dbName;
      this.connection = connection.db(this.dbName);

      return Promise.resolve(this.connection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async insert(collectionName: string, document: Document): Promise<InsertOneWriteOpResult> {
    try {
      const collection: Collection = await this.connection.collection(collectionName);
      const result: InsertOneWriteOpResult = await collection.insertOne(document);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(collectionName: string, id: string): Promise<object> {
    try {
      const collection: Collection = await this.connection.collection(collectionName);
      const result: object = await collection.findOne({ _id: id });
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async replace(collectionName: string, document: Document): Promise<UpdateWriteOpResult> {
    try {
      const collection: Collection = await this.connection.collection(collectionName);
      const result: UpdateWriteOpResult = await collection.replaceOne({ _id: document._id }, document);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // tslint:disable-next-line:max-line-length
  public async update(collectionName: string, document: Document, upsert: boolean = true): Promise<UpdateWriteOpResult> {
    try {
      const collection: Collection = await this.connection.collection(collectionName);
      const result: UpdateWriteOpResult = await collection.updateOne(
        { _id: document._id },
        { $set: document },
        { upsert } // Insert as new document with the 'what' if this document doesn't exist
      );
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(collectionName: string, id: string): Promise<DeleteWriteOpResultObject> {
    try {
      const collection: Collection = await this.connection.collection(collectionName);
      const result: DeleteWriteOpResultObject = await collection.deleteOne({ _id: id });
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default MongoDB;