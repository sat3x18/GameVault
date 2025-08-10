export interface GameItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export interface PurchaseRequest {
  itemTitle: string;
  discordUsername: string;
  message?: string;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface ItemFormData {
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}