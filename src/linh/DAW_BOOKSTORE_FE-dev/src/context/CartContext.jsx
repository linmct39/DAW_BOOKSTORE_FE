import React, { createContext, useContext, useState } from 'react';
import { mockBooks } from '../data/mockData';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(
        mockBooks.slice(0, 3).map((book) => ({
            ...book,
            quantity: 0,
        }))
    );

    const addToCart = (book) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === book.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: 0 } : item
            )
        );
    };

    const updateQuantity = (id, qty) => {
        if (qty < 0) return;

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
    };

    const getTotalPrice = () =>
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const getTotalItems = () =>
        cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const activeItems = cartItems.filter((item) => item.quantity > 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                activeItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}