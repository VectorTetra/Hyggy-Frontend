import styles from "../css/ArticleGrid.module.css";
import Link from "next/link";
import ImageWithFallback from "../../sharedComponents/ImageWithFallback";
export default function ArticleGrid(props: any) {
	return (
		<div id={styles.articleGrid}>
			{props.blogs.map((article: any) => (
				<Link prefetch={true} className={styles.articleLink} key={article.id} href={`/article/${article.id}`}>

					<div className={styles.articleImageContainer}>
						<ImageWithFallback
							className={styles.articleImage}
							src={article.image}
							alt={article.title}
							fallbackSrc='/images/imageFallback.png'
							title={article.title}
							layout="responsive"
							objectFit="cover"
							width={800}
							height={600}
						/>
					</div>
					<div className={styles.articleInfo}>
						<h3>{article.title}</h3>
						<p>{article.description}</p>
					</div>

				</Link>
			))}
		</div>
	);
}