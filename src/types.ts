export interface User {
  uid: string;
  id?: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
}

export interface Category {
  id: string | number;
  name: string;
  description?: string;
}

export interface Book {
  id: string | number;
  title: string;
  author: string;
  price: number;
  description: string;
  category_id: string | number;
  stock?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  category?: Category;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  book?: Book;
}

export interface Invoice {
  id: string;
  userId: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  bookId: string;
  quantity: number;
  priceAtPurchase: number;
}
