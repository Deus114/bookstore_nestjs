type ID<K, T> = K & { __idBrand: T };

export type EntityId = ID<string, 'entity_id'>;

export type Relation =
  | 'category'
  | 'orderDetails'
  | 'user'
  | 'book'
  | 'order'
  | 'items'
  | 'items.book'
  | 'cart'
  | 'cart.items'
  | 'userAddress'
  | 'userAddress.user';
