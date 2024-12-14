import Image from 'next/image';
import styles from "../css/CartPopup.module.css";
import Link from 'next/link';
import useLocalStorageStore from '@/store/localStorage'; // Імпортуємо store
import { useEffect } from 'react'; // Імпортуємо useEffect

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  oldPrice: string;
  selectedOption: string;
}

interface CartPopupProps {
  onClose: () => void;
  selectedOption: string;
}

const CartPopup: React.FC<CartPopupProps> = ({ onClose, selectedOption }) => {
  const { cart, removeFromCart } = useLocalStorageStore(); // Отримуємо стан з store

  // Обчислення загальної ціни
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + item.product.finalPrice * item.quantity;
    }, 0);
  };

  const calculateQuantity = () => {
    return cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const deliveryPrice = selectedOption === 'delivery' ? 100 : 0;
  const totalPrice = Math.ceil(calculateTotalPrice() + deliveryPrice);

  // Викликаємо onClose, якщо корзина пуста
  useEffect(() => {
    if (cart.length === 0) {
      onClose();
    }
  }, [cart, onClose]); // Спрацьовує, коли змінюється корзина

  // Логіка для відображення тільки останнього товару
  const lastItem = cart[cart.length - 1];

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div onClick={onClose} className={styles.close}>&times;</div>
        {cart.length === 0 ? (
          <p>Кошик пустий</p>
        ) : (
          <div className={styles.productInfo}>
            <Image
              src={lastItem.product.previewImagePath}
              alt={lastItem.product.description}
              width={197}
              height={191}
            />
            <div>
              <p>{lastItem.product.description}</p>
              <p className={styles.price}>{Math.round(Number(lastItem.product.finalPrice))} грн</p>
              <p className={styles.oldprice}>{lastItem.product.price} грн</p>
              <p
                className={styles.delete}
                onClick={() => {
                  removeFromCart(cart.length - 1); // Видаляємо останній товар
                }}
              >
                Видалити
              </p>
            </div>
          </div>
        )}
        <center><hr className={styles.customHr} /></center>
        <div className={styles.deliveryInfo}>
          <p>
            <span className={styles.info}>Доставка: </span>
            <span className={styles.priceAmount}>{deliveryPrice} грн</span>
          </p>
          <p>
            <span className={styles.info}>Сума ({calculateQuantity()} товарів): </span>
            <span className={styles.priceAmount}>{totalPrice} грн</span>
          </p>
          <Link prefetch={true} href="/cart" passHref>
            <button className={styles.resumeButton}>Продовжити</button>
          </Link>
          <p onClick={onClose} className={styles.closeButton}>Продовжити покупки</p>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
