import { Product } from "./product.model";

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
  paymentMethod: string;
  cardholderName: string;
  cardNumber: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  size: string;
  quantity: number;
  price: number;
  discountedPrice: number;
}

export interface Order {
  id: number;
  orderId: string;
  orderItems: OrderItem[];
  orderDate: string;
  deliveryDate: string;
  shippingAddress: Address;
  totalPrice: number;
  totalDiscountedPrice: number;
  discounte: number;
  orderStatus: string;
  totalItem: number;
}