import {Controller, IController} from '@kibcode/mongodb-controllers';
import {ECollection, TDbSchemaEntity} from '~/shared/db';
import {Container} from 'typedi';
import {Database} from '~/shared/services';

/**
 * Returns base controller for specified collection
 * @param collection
 * @constructor
 */
export function BaseController<C extends ECollection>(collection: C) {
  return class BaseController {
    db: IController<TDbSchemaEntity<C>, false, false>;

    constructor() {
      this.db = Controller<TDbSchemaEntity<C>, false, false>({
        collection: Container.get(Database).collection(collection),
        useSoftDelete: false,
        useTimestamps: false,
      });
    }
  }
}