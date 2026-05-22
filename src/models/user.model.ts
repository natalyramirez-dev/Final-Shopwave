import { Role } from "@/types/role.type";

export interface Address {
  id?: number;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: Role;
  addresses: Address[];
  createdAt?: string;
}