import styles from "../css/SpecificationWare.module.css";
import { Product } from '../types/Product';

export default function SpecificationWare({ properties }: { properties: any[] }) {
  return (
    <div className={styles.specificationsTable}>
      {properties.map((spec, index) => (
        <div key={index} className={styles.specRow}>
          <div className={styles.specName} dangerouslySetInnerHTML={{ __html: spec.propertyName }}></div>
          <div className={styles.specValue} dangerouslySetInnerHTML={{ __html: spec.propertyValue }}></div>
        </div>
      ))}
    </div>
  );
}
