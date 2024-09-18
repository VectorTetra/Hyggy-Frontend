import Image from "next/image";
import styles from "../css/DescriptionWare.module.css";
import { Product } from '../types/Product';


export default function DescriptionWare({ product }: { product: Product }) {
  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.textContainer}>
        <p className={styles.descriptionText}>{product.descriptionText}</p>
        <p className={styles.articleText}>Артикул: {product.articleNum}</p>
      </div>
      <div className={styles.descImage}>
        <Image src={product.descriptionImage} alt={product.productName} layout="fill" />
      </div>
    </div>
  );
}
