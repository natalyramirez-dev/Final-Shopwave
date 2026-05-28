export interface Size {
  name: string;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  parentCategory?: Category;
  level: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPersent: number;
  quantity: number;
  brand: string;
  color: string;
  sizes: Size[];
  imageUrl: string;
  numRatings: number;
  category: Category;
  createdAt: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPersent: number;
  quantity: number;
  brand: string;
  color: string;
  imageUrl: string;
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
  size: { name: string; quantity: number }[];
}