import styles from "../page.module.css";

interface ProductPriceProps {
    finalPrice: number;
    oldPrice: number;
    discount: number;
}

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0';
    const roundedValue = Math.round(value * 100) / 100;
    return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `;
};

const ProductPrice: React.FC<ProductPriceProps> = ({ finalPrice, oldPrice, discount }) => (
    <div className={styles.price}>
        <span className={styles.currentPrice}>{formatCurrency(finalPrice)}грн / шт</span>
        {oldPrice !== finalPrice && oldPrice !== 0 && <span className={styles.oldPrice}>{formatCurrency(oldPrice)} грн / шт</span>}
        {discount! > 0 && <span className={styles.discountSticker}> - {discount} %</span>}
    </div>
);

export default ProductPrice;
