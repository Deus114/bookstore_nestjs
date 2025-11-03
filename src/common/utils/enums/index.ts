// Order Payment Types (legacy, keep for backward compatibility)
export enum OrderPaymentType {
  COD = 'COD',
  BANKING = 'BANKING',
}

// Order Status
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Order Payment Status
export enum OrderPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'UNPAID',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Order Payment Method
export enum OrderPaymentMethod {
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cod',
  BANKING = 'BANKING',
}

// User Roles
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// User Types
export enum UserType {
  SYSTEM = 'SYSTEM',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}
