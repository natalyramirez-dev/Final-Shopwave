import { User } from "@/models/user.model";

const USER_KEY = "shopwave_user";

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser) as User;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};