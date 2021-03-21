import {Database as GenericDatabase} from '~/shared/lib/mongo/Database';
import {Inject, Service} from 'typedi';
import {IDbSchemaMap} from '~/shared/db';
import {ConfigToken, MongoClientToken, Config, MongoClient} from '~/shared/di';

@Service()
export class Database extends GenericDatabase<IDbSchemaMap> {
  constructor(
    @Inject(MongoClientToken) mongoClient: MongoClient,
    @Inject(ConfigToken) config: Config,
  ) {
    super(mongoClient.db(config.dbName));
  }
}