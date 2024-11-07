import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
import { useCartQuantity } from "@/app/cart/types/Cart";

function MainPageHeaderBasket(props) {
  const cartQuantity = useCartQuantity(); // Отримуємо кількість товарів

  return (
    <Link href="/cart" className={styles.mainPageHeaderItem}>
      <div style={{ position: 'relative' }}>
        <Image
          id={styles.mainPageHeaderUserPhoto}
          className={styles.mainPageHeaderBasketPhoto}
          src={props.basketPhotoUrl}
          alt="logo"
          width={props.basketPhotoWidth}
          height={props.basketPhotoHeight}
          priority={true}
        />
        {/* Відображаємо кількість товарів, якщо вона більша за 0 */}
        {cartQuantity > 0 && (
          <div className={styles.cartQuantityBadge}>
            {cartQuantity}
          </div>
        )}
      </div>
      <div className={styles.disappearOnAdapt}>Кошик</div>
    </Link>
  );
}

export default MainPageHeaderBasket;
