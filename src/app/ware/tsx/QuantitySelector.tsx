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
        <div className={styles.quantityContainer}>
            <button onClick={handleDecrease}>-</button>
            <input type="text" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <button onClick={handleIncrease}>+</button>
        </div>
    );
};

export default QuantitySelector;
