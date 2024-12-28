import styles from "../page.module.css";
import { formatCurrency } from "@/app/sharedComponents/methods/formatCurrency";

interface ProductPriceProps {
    finalPrice: number;
    oldPrice: number;
    discount: number;
}



const ProductPrice: React.FC<ProductPriceProps> = ({ finalPrice, oldPrice, discount }) => (
    <div className={styles.price}>
        <span className={styles.currentPrice}>{formatCurrency(finalPrice, "грн / шт")}</span>
        {oldPrice !== finalPrice && oldPrice !== 0 && <span className={styles.oldPrice}>{formatCurrency(oldPrice, "грн / шт")}</span>}
        {discount! > 0 && <span className={styles.discountSticker}> - {discount} %</span>}
    </div>
);

export default ProductPrice;
