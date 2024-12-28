"use client";
import { useState, useEffect } from "react";
import Layout from "../sharedComponents/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { CircularProgress } from "@mui/material";
import useLocalStorageStore from '@/store/localStorage';
import Link from "next/link";
import { formatCurrency } from "../ware/tsx/ProductPrice";

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  oldPrice: string;
  selectedOption: string;
}

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    setSelectedShop,
    increaseQuantity,
    decreaseQuantity,
    handleQuantityChange,
  } = useLocalStorageStore();

  useEffect(() => {
    document.body.style.overflow = "auto";
    updateCartQuantity(); // Оновлення кількості товарів
    setLoading(false);
  }, [updateCartQuantity]);

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
  };

  const calculateTotalPrice = () => {
    const deliveryPrice =
      cart.length > 0 && cart[0].selectedOption === "delivery" ? 100 : 0;
    return cart.reduce((total, item) => {
      return total + item.product.finalPrice * item.quantity;
    }, deliveryPrice);
  };

  const calculatePDV = () => {
    const PDVRate = 0.2;
    const totalProductPrice = cart.reduce((total, item) => {
      return total + item.product.finalPrice * item.quantity;
    }, 0);
    return totalProductPrice * PDVRate;
  };

  const calculateTotalSavings = () => {
    return cart.reduce((totalSavings, item) => {
      if (item.product.price) {
        const oldPrice = item.product.price;
        const price = item.product.finalPrice;
        const savings = (oldPrice - price) * item.quantity;
        return totalSavings + savings;
      }
      return totalSavings;
    }, 0);
  };

  const handleContinueShopping = () => {
    if (document.referrer.includes("/cart")) {
      router.push("/");
    } else {
      router.back();
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.cartPage}>
        <center>
          <h2>Огляд кошика</h2>
        </center>
        {cart.length === 0 ? (
          <center>
            <p>Кошик пустий</p>
            <button
              className={styles.continueButton}
              onClick={handleContinueShopping}
            >
              Продовжити покупки
            </button>
          </center>
        ) : (
          <div className={styles.cartItems}>
            {cart.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <p
                  onClick={() => handleRemoveItem(index)}
                  className={styles.removeButton}
                >
                  ×
                </p>
                <Image
                  src={item.product.previewImagePath}
                  alt={item.product.description}
                  width={84}
                  height={90}
                  className={styles.cartItemImage}
                />
                <div className={styles.productDescription}>
                  <p>{item.product.description}</p>
                  <p className={styles.product}>{item.product.name}</p>
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
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => increaseQuantity(index)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.price}>
                  <p>{formatCurrency(item.product.finalPrice)} грн </p>
                  <p>{formatCurrency(item.product.finalPrice * item.quantity)} грн</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div>
            <div className={styles.cartInfo}>
              {calculateTotalSavings() > 0 && (
                <p>
                  Загальна економія {formatCurrency(calculateTotalSavings())} грн
                </p>
              )}
              <p>
                Доставка{" "}
                {formatCurrency(
                  cart.length > 0 && cart[0].selectedOption === "delivery"
                    ? 100
                    : 0
                )}{" "}
                грн
              </p>
              <p>Сума ПДВ {formatCurrency(calculatePDV())} грн</p>
              {cart.length > 0 &&
                cart[0].selectedOption === "delivery" && (
                  <p>Доставка протягом 10-12 робочих днів</p>
                )}
            </div>
            <br />
            <p className={styles.calculateTotalPrice}>
              Всього {formatCurrency(calculateTotalPrice())} грн
            </p>
            <div className={styles.buttonContainer}>
              <Link href="/cart/address">
                <button className={styles.checkoutButton}>
                  Завершити замовлення
                </button>
              </Link>
              <button
                className={styles.continueButton}
                onClick={handleContinueShopping}
              >
                Продовжити покупки
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
