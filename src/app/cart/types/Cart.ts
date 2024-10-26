import { useEffect, useState } from 'react';

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;
  oldPrice: string;
  selectedOption: string;
}

export const getCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
  window.dispatchEvent(new Event('storage'));
};


export const addToCart = (cartItems: CartItem[], newItem: CartItem): CartItem[] => {
  const existingItemIndex = cartItems.findIndex(
    item => item.productName === newItem.productName && item.selectedOption === newItem.selectedOption
  );
  let updatedCart;
  if (existingItemIndex !== -1) {
    updatedCart = cartItems.map((item, index) =>
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  } else {
    updatedCart = [...cartItems, newItem];
  }
  saveCartToLocalStorage(updatedCart);
  return updatedCart;
};


export const removeFromCart = (cartItems: CartItem[], index: number): CartItem[] => {
  const updatedCart = cartItems.filter((_, i) => i !== index);
  saveCartToLocalStorage(updatedCart);
  return updatedCart;
};

export const clearCartFromLocalStorage = (): void => {
  localStorage.removeItem('cart');
};

export const useCartQuantity = () => {
  const [cartQuantity, setCartQuantity] = useState(0);

  const updateCartQuantity = () => {
    const cartItems = getCartFromLocalStorage();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartQuantity(totalQuantity);
  };

  useEffect(() => {
    updateCartQuantity();
    const handleStorageChange = () => {
      updateCartQuantity();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return cartQuantity;
};
