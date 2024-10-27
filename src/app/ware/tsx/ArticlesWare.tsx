import Image from "next/image";
import Link from "next/link";
import styles from "../css/ArticlesWare.module.css";
import { Product } from '../types/Product';

export default function ArticlesWare({ product }: { product: Product }) {
  return (
    <div className={styles.relatedArticlesWrapper}>
      <div className={styles.relatedArticlesSection}>
        <div className={styles.relatedArticles}>
          {product.relatedArticles.map((article, index) => (
              <div key={index} className={styles.articleCard}>
                <Link className={styles.articleLink} href={`/article/${article.id}`}>
                <div className={styles.articleImage}>
                  <Image src={article.image} alt={article.title} layout="fill" />
                </div>
                <p className={styles.articleTitle}>{article.title}</p>
                </Link>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
