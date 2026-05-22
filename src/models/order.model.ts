import { Address, User } from "./user.model";
import { Product } from "./product.model";

export interface OrderItem {
  id: number;
  product: Product;
  size: string;
  quantity: number;
  price: number;
  discountedPrice: number;
  deliveryDate: string;
}

export interface Order {
  id: number;
  orderId: string;
  user: User;
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

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
  paymentMethod: string;
  cardholderName?: string;
  cardNumber?: string;
}