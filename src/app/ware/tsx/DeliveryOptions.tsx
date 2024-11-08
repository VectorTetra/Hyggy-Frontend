import { useState } from "react";
import styles from "../page.module.css";

interface DeliveryOptionsProps {
    isDeliveryAvailable: boolean;
    storeCount: number;
    onSelectOption: (option: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ isDeliveryAvailable, storeCount, onSelectOption }) => {
    const [selectedOption, setSelectedOption] = useState("delivery");

    return (
        <div className={styles.deliveryOptionsContainer}>
            <div className={`${styles.deliveryOption} ${selectedOption === "delivery" ? styles.activeOption : ""}`}
                onClick={() => {
                    setSelectedOption("delivery");
                    onSelectOption("delivery");
                }}>
                <span>Доставка</span>
                <span>{isDeliveryAvailable ? "Є доставка" : "Немає доставки"}</span>
            </div>
            <div className={`${styles.deliveryOption} ${selectedOption === "store" ? styles.activeOption : ""}`}
                onClick={() => {
                    setSelectedOption("store");
                    onSelectOption("store");
                }}>
                <span>В магазинах ({storeCount})</span>
            </div>
        </div>
    );
};

export default DeliveryOptions;
