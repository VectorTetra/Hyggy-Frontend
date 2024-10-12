import styles from "../css/SpecificationWare.module.css";
import { Product } from '../types/Product';

export default function SpecificationWare({ product }: { product: Product }) {
  return (
    <div className={styles.specificationsTable}>
      {product.specifications.map((spec, index) => (
        <div key={index} className={styles.specRow}>
          <div className={styles.specName}>{spec.name}</div>
          <div className={styles.specValue}>{spec.value}</div>
        </div>
      ))}
    </div>
  );
}
