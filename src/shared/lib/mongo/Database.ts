import {Collection, CollectionCreateOptions, Db} from 'mongodb';

export class Database<Schema extends Record<string, any> = any> {
  private readonly db: Db;

  public constructor(db: Db) {
    this.db = db;
  }

  /**
   * Creates new collection.
   * @param name
   * @param options
   */
  public async createCollection<Name extends keyof Schema>(
    name: Name,
    options?: CollectionCreateOptions,
  ): Promise<Collection<Schema[Name]>> {
    const collections = await this.db.collections();
    const collection = collections.find(c => c.collectionName === name);

    return collection ||
      this.db.createCollection<Schema[Name]>(name as string, options);
  }

  /**
   * Returns collection by its name.
   * @param name
   */
  public collection<Name extends keyof Schema>(
    name: Name,
  ): Collection<Schema[Name]> {
    return this.db.collection<Schema[Name]>(name as string);
  }

  /**
   * Drops collection.
   * @param collection
   */
  public dropCollection(collection: keyof Schema): Promise<boolean> {
    return this.db.dropCollection(collection as string);
  }
}
