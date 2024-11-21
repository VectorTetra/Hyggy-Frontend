import Image from "next/image";
import Link from "next/link";
import styles from "../css/ArticlesWare.module.css";
import { Product } from '../types/Product';
import { Blog } from "@/pages/api/BlogApi";

export default function ArticlesWare({ blogs }: { blogs: Blog[] }) {
  return (
    <div className={styles.relatedArticlesWrapper}>
      <div className={styles.relatedArticlesSection}>
        <h3 style={{ marginTop: "20px" }}>Пов'язані статті в блозі</h3>
        <div className={styles.relatedArticles}>
          {blogs.map((blog, index) => (
            <div key={index} className={styles.articleCard}>
              <Link prefetch={true} className={styles.articleLink} href={`/article/${blog.id}`}>
                <div className={styles.articleImageContainer}>
                  <Image className={styles.articleImage} src={blog.previewImagePath} alt={blog.blogTitle} layout="fill" />
                </div>
                <p className={styles.articleTitle}>{blog.blogTitle}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
