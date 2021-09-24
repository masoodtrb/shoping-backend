// Masoud Torabi

import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDataSource } from '../datasources';
import { Product, ProductRelations } from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.name,
  ProductRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Product, dataSource);
  }
}
