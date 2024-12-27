import styles from "../css/ArticleGrid.module.css";
import Link from "next/link";
import ImageWithFallback from "../../sharedComponents/ImageWithFallback";
export default function ArticleGrid(props: any) {
	console.log(props.blogs);
	return (
		<div id={styles.articleGrid}>
			{props.blogs.map((blog: any) => (
				<Link prefetch={true} className={styles.articleLink} key={blog.id} href={`/PageBlogIndividual/${blog.id}`}>

					<div className={styles.articleImageContainer}>
						<ImageWithFallback
							className={styles.articleImage}
							src={blog.previewImagePath}
							alt={blog.blogTitle}
							fallbackSrc='/images/imageFallback.png'
							title={blog.blogTitle}
							layout="responsive"
							objectFit="cover"
							width={800}
							height={600}
						/>
					</div>
					<div className={styles.articleInfo}>
						{blog.blogTitle}
					</div>

				</Link>
			))}
		</div>
	);
}