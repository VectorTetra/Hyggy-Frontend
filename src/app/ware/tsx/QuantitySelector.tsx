import { useState } from "react";
import styles from "../page.module.css";

interface QuantitySelectorProps {
    initialQuantity: number;
    onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ initialQuantity, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleDecrease = () => {
        const newQuantity = quantity > 1 ? quantity - 1 : 1;
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    return (
        // <div className={styles.quantityContainer}>
        //     <button onClick={handleDecrease}>-</button>
        //     <input type="text" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={styles.quantityInput} />
        //     <button onClick={handleIncrease}>+</button>
        // </div>
        <span className={styles.quantityContainer}>
            <button className={styles.quantityButton} onClick={handleDecrease}>-</button>
            <input
                type="text"
                value={quantity}
                onChange={() => onQuantityChange}
                className={styles.quantityInput}
            />
            <button className={styles.quantityButton} onClick={handleIncrease}>+</button>
        </span>
    );
};

export default QuantitySelector;
