export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface CartItem extends Product {
  quantity: number;
}
