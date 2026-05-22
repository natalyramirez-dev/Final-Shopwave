import { Role } from "@/types/role.type";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: Role;
  createdAt?: string;
}