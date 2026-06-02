import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: { id: string; title: string; author: string; price: number; imageUrl: string; stock: number }, quantity?: number) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("bookstore_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem("bookstore_cart");
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("bookstore_cart", JSON.stringify(items));
  };

  const addToCart = (
    book: { id: string; title: string; author: string; price: number; imageUrl: string; stock: number },
    quantity = 1
  ) => {
    // Validate book ID is numeric or can be converted to numeric
    const bookId = String(book.id);
    const numericId = Number(bookId);
    if (isNaN(numericId) || numericId <= 0) {
      alert(`Lỗi: Sách "${book.title}" có ID không hợp lệ (${bookId}). Vui lòng làm mới trang và thử lại.`);
      return;
    }

    const existing = cartItems.find((item) => item.bookId === book.id);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > book.stock) {
        alert(`Rất tiếc! Chỉ còn ${book.stock} cuốn trong kho.`);
        return;
      }
      const updated = cartItems.map((item) =>
        item.bookId === book.id ? { ...item, quantity: newQty } : item
      );
      saveCart(updated);
    } else {
      if (quantity > book.stock) {
        alert(`Rất tiếc! Chỉ còn ${book.stock} cuốn trong kho.`);
        return;
      }
      const newItem: CartItem = {
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl,
        quantity,
        stock: book.stock,
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    const item = cartItems.find((i) => i.bookId === bookId);
    if (item && quantity > item.stock) {
      alert(`Rất tiếc! Chỉ còn ${item.stock} cuốn trong kho.`);
      return;
    }
    const updated = cartItems.map((i) =>
      i.bookId === bookId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const removeFromCart = (bookId: string) => {
    const updated = cartItems.filter((i) => i.bookId !== bookId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
