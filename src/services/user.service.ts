import { fetchApi } from "./api.service";
import { User } from "@/models/user.model";

export const userService = {
  getUserProfile: () => {
    return fetchApi<User>("/users/profile");
  }
};