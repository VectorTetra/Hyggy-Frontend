import Image from 'next/image';
import styles from "../css/CartPopup.module.css";

interface CartItem {
  productDescription: string;
  productImage: string;
  quantity: number;
  price: string;
  oldPrice: string;
  selectedOption: string;
}

interface CartPopupProps {
  cartItems: CartItem[];
  selectedOption: string;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ cartItems, onClose, onRemoveItem, selectedOption }) => {
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  const calculateQuantity = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const deliveryPrice = selectedOption === 'delivery' ? 100 : 0;
  const totalPrice = calculateTotalPrice() + deliveryPrice;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p onClick={onClose} className={styles.close}>×</p>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          cartItems.slice(-1).map((item, index) => (
            <div key={index} className={styles.productInfo}>
              <Image src={item.productImage} alt={item.productDescription} width={197} height={191} />
              <div>
                <p>{item.productDescription}</p>
                <p className={styles.oldprice}>{item.oldPrice} грн</p>
                <p className={styles.price}>{item.price} грн</p>
                <p className={styles.delete} onClick={() => {
          onRemoveItem(cartItems.length - 1); 
        }}>Видалити</p>
              </div>
            </div>
          ))
        )}
        <hr />
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
          <p><button onClick={onClose} className={styles.resumeButton}>Продовжити</button></p>
          <p onClick={onClose} className={styles.closeButton}>Продовжити покупки</p>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
