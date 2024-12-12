import { WareGetDTO } from "@/pages/api/WareApi";
import styles from "../css/DescriptionWare.module.css";
import Image from "next/image";

export default function DescriptionWare({ article, description, product }: { article: number, description: string | null, product: WareGetDTO }) {
  return (
    <div className={styles.descriptionContainer}>
      {/* <h2 className={styles.title}>Опис</h2> */}
      <div className={styles.textContainer}>
        {description && (
          <div
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <p className={styles.articleText}>Артикул: {article}</p>
      </div>
      <div style={{ display: "flex", flex: 0.4 }}>
        <Image
          src={product.imagePaths.length > 1 ? product.imagePaths[1] : product.previewImagePath}
          alt={product.name}
          width={150} // Максимальна ширина в пікселях
          height={200} // Максимальна висота в пікселях
          layout='responsive' // Розмір залежить від оригінальних пропорцій зображення
          objectFit='contain' // Показує повне зображення, не розтягуючи його
          style={{
            maxWidth: "100%",
            maxHeight: "200px", // Обмеження максимальної висоти
            height: "auto", // Автоматична висота для адаптації
            objectFit: "contain" // Показує повне зображення, не розтягуючи його
          }}
          unoptimized={true}  // Вимикає оптимізацію зображення
        />
      </div>
    </div>
  );
}
