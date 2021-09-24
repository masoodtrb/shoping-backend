// Masoud Torabi
import { Entity, hasMany, hasOne, model, property } from '@loopback/repository';
import { Order } from './order.model';
import { ShoppingCart } from './shopping-cart.model';
import { UserCredentials } from './user-credentials.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasOne(() => ShoppingCart)
  shoppingCart: ShoppingCart;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'string',
  })
  resetKey?: string;

  @property({
    type: 'number',
  })
  resetCount: number;

  @property({
    type: 'string',
  })
  resetTimestamp: string;

  @property({
    type: 'string',
  })
  resetKeyTimestamp: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
