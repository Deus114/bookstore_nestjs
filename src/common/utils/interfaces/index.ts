// User Interfaces
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
}

export interface UserPayload {
  sub: string;
  iss: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

// Response Interfaces
export interface Response<T> {
  statusCode: number;
  message: string;
  data: any;
}

export interface PaginationMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  result: T[];
}

// Order Interfaces
export interface CreateOrderData {
  userId: string;
  name: string;
  address: string;
  phone: string;
  type: 'COD' | 'BANKING';
  totalPrice: number;
  orderDetails: any[]; // Will be replaced with proper DTO reference
}
