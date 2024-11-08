import styles from "../page.module.css";

interface ProductPriceProps {
    finalPrice: number;
    oldPrice: number;
    discount?: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ finalPrice, oldPrice, discount }) => (
    <div className={styles.price}>
        <span className={styles.currentPrice}>{finalPrice} грн / шт</span>
        {oldPrice !== finalPrice && <span className={styles.oldPrice}>{oldPrice} грн / шт</span>}
        {discount && <span className={styles.discountSticker}> - {discount} %</span>}
    </div>
);

export default ProductPrice;
