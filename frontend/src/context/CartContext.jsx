import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find(x => x.product === product._id);
    
    if (existItem) {
      setCartItems(cartItems.map(x => 
        x.product === existItem.product ? { ...existItem, qty: existItem.qty + qty } : x
      ));
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        image: product.image || product.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=00F0FF&color=050505`,
        price: product.price,
        qty
      }]);
    }
  };

  const updateQty = (id, qty) => {
    setCartItems(cartItems.map(x => x.product === id ? { ...x, qty } : x));
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(x => x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, cartItemsCount, itemsPrice }}>
      {children}
    </CartContext.Provider>
  );
};
