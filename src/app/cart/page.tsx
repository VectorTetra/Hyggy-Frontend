"use client";
import { useState, useEffect } from "react";
import Layout from "../sharedComponents/Layout";
import Image from "next/image";
import styles from "./page.module.css";
import {
  getCartFromLocalStorage,
  saveCartToLocalStorage,
  removeFromCart
} from "../ware/types/Cart";

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;
  oldPrice: string;
  selectedOption: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCartItems = getCartFromLocalStorage();
    setCartItems(savedCartItems);
  }, []);

  const handleRemoveItem = (index: number) => {
    const updatedCart = removeFromCart(cartItems, index);
    setCartItems(updatedCart);
  };

  const calculateTotalPrice = () => {
    const deliveryPrice = cartItems.length > 0 && cartItems[0].selectedOption === 'delivery' ? 100 : 0;
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, deliveryPrice);
  };

  const calculatePDV = () => {
    const PDVPrice = 131.67;
    return cartItems.reduce((total, item) => {
      return PDVPrice * item.quantity;
    }, PDVPrice);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity > 0 ? newQuantity : 1;
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const increaseQuantity = (index: number) => {
    handleQuantityChange(index, cartItems[index].quantity + 1);
  };

  const decreaseQuantity = (index: number) => {
    handleQuantityChange(index, cartItems[index].quantity - 1);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  const calculateTotalSavings = () => {
    return cartItems.reduce((totalSavings, item) => {
      if (item.oldPrice) {
        const oldPrice = parseFloat(item.oldPrice);
        const price = parseFloat(item.price);
        const savings = (oldPrice - price) * item.quantity;
        return totalSavings + savings;
      }
      return totalSavings;
    }, 0);
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.cartPage}>
        <center><h1>Огляд кошика</h1></center>
        {cartItems.length === 0 ? (
          <center>
            <p>Кошик пустий</p>
            <button className={styles.continueButton}>Продовжити покупки</button>
          </center>
        ) : (
          <div className={styles.cartItems}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <p onClick={() => handleRemoveItem(index)} className={styles.removeButton}>×</p>
                <Image
                  src={item.productImage}
                  alt={item.productDescription}
                  width={84}
                  height={90}
                  className={styles.cartItemImage}
                />
                <div className={styles.productDescription}>
                  <p>{item.productDescription}</p>
                  <p className={styles.product}>{item.productName}</p>
                </div>
                <div className={styles.quantityContainer}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => decreaseQuantity(index)}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => increaseQuantity(index)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.price}>{item.price} грн</div>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className={styles.cartSummary}>
            <div className={styles.cartInfo}>
              {calculateTotalSavings() > 0 && (
                <p>Загальна економія {formatPrice(calculateTotalSavings())} грн</p>
              )}
              <p>Доставка {formatPrice(cartItems.length > 0 && cartItems[0].selectedOption === 'delivery' ? 100 : 0)} грн</p>
              <p>Сума ПДВ {formatPrice(calculatePDV())}</p>
              {cartItems.length > 0 && cartItems[0].selectedOption === 'delivery' && (
                <p>Доставка протягом 10-12 робочих днів</p>
              )}
            </div>
            <br />
            <p className={styles.calculateTotalPrice}>Усього {formatPrice(calculateTotalPrice())} грн</p>
            <button className={styles.continueButton}>Продовжити покупки</button>
            <button className={styles.checkoutButton}>Завершити замовлення</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
