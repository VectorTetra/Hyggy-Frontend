interface CartItem {
    productDescription: string;
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
  };
  
  export const addToCart = (cartItems: CartItem[], newItem: CartItem): CartItem[] => {
    const updatedCart = [...cartItems, newItem];
    saveCartToLocalStorage(updatedCart);
    return updatedCart;
  };
  
  export const removeFromCart = (cartItems: CartItem[], index: number): CartItem[] => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    saveCartToLocalStorage(updatedCart);
    return updatedCart;
  };
  