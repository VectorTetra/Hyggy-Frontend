import { useState } from "react";
import styles from "../page.module.css";

interface DeliveryOptionsProps {
    isDeliveryAvailable: boolean;
    storeCount: number;
    onSelectOption: (option: string) => void;
    selectedOption: string;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ selectedOption, isDeliveryAvailable, storeCount, onSelectOption }) => {
    // const [selectedOption, setSelectedOption] = useState("delivery");

    return (
        // <div className={styles.deliveryOptionsContainer}>
        //     <div className={`${styles.deliveryOption} ${selectedOption === "delivery" ? styles.activeOption : ""}`}
        //         onClick={() => {
        //             setSelectedOption("delivery");
        //             onSelectOption("delivery");
        //         }}>
        //         <span>Доставка</span>
        //         <span>{isDeliveryAvailable ? "Є доставка" : "Немає доставки"}</span>
        //     </div>
        //     <div className={`${styles.deliveryOption} ${selectedOption === "store" ? styles.activeOption : ""}`}
        //         onClick={() => {
        //             setSelectedOption("store");
        //             onSelectOption("store");
        //         }}>
        //         <span>В магазинах ({storeCount})</span>
        //     </div>
        // </div>
        <div className={styles.deliveryOptionsContainer}>
            <div
                className={`${styles.deliveryOption} ${selectedOption === "delivery" ? styles.activeOption : ""
                    }`} onClick={() => onSelectOption("delivery")}>
                <div className={styles.optionTitle}>Доставка</div>
                <span className={styles.optionDot}>{!isDeliveryAvailable ? <span><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="red" />
                </svg></span> : <span><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="#33FF00" />
                </svg></span>}</span>
                <span>{isDeliveryAvailable ? "Є доставка" : "Немає доставки"}</span>
            </div>
            <div className={`${styles.storeCount} ${selectedOption === "store" ? styles.activeOption : ""
                }`} onClick={() => onSelectOption("store")}>
                <div className={styles.storeTitle}>В магазинах</div>
                <span className={styles.optionDot}>{storeCount === 0 ? <span><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="red" />
                </svg></span> : <span><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="#33FF00" />
                </svg></span>}</span>
                <span>В наявності в {storeCount} магазинах</span>
            </div>
        </div>
    );
};

export default DeliveryOptions;
