import styles from "../css/DescriptionWare.module.css";

export default function DescriptionWare({ article, description }: { article: number, description: string | null }) {
  return (
    <div className={styles.descriptionContainer}>
      <h2 className={styles.title}>Опис</h2>
      <div className={styles.textContainer}>
        {description && (
          <div
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <p className={styles.articleText}>Артикул: {article}</p>
      </div>
    </div>
  );
}
