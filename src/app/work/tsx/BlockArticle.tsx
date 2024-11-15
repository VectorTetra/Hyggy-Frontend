import styles from '../css/BlockArticle.module.css';
import Image from 'next/image';
export default function BlockArticle({ blocks }) {
	return (
		<div className={styles.blockArticle}>
			{blocks.map((block: any, index: any) => {
				if (block.type === "wideTextArticle") {
					return (
						<div key={index} className={styles.wideTextArticle}>
							{block.textContent.map((textBlock: any, index: any) => (
								<div className={`${textBlock.type === "headerText" ? styles.wideTextArticleItemForHeader : styles.wideTextArticleItem}`}>
									{textBlock.type === "headerText" && <h1 key={index}>{textBlock.text}</h1>}
									{textBlock.type === "paragraph" && <p key={index}>{textBlock.text}</p>}
								</div>
							))}
						</div>
					);
				}
				if (block.type === "halvedRightImageArticle") {
					return (
						<div key={index} className={styles.halvedRightImageArticle}>
							<div className={styles.halvedRightImageArticleText}>
								{block.textContent.map((textBlock: any, index: any) => (
									<div key={index}>
										{textBlock.type === "headerText" && <h1>{textBlock.text}</h1>}
										{textBlock.type === "paragraph" && <p>{textBlock.text}</p>}
									</div>
								))}
							</div>
							<div className={styles.halvedRightImageArticleImageContainer}>
								<Image
									width={570}
									height={500}
									src={block.imgSrc}
									alt={""}
									className={styles.halvedRightImageArticleImage}
								/>
							</div>
						</div>
					);
				}
				if (block.type === "halvedLeftImageArticle") {
					return (
						<div key={index} className={styles.halvedLeftImageArticle}>
							<div className={styles.halvedLeftImageArticleImageContainer}>
								<Image
									width={570}
									height={500}
									src={block.imgSrc}
									alt={""}
									className={styles.halvedLeftImageArticleImage}
								/>
							</div>
							<div className={styles.halvedLeftImageArticleText}>
								{block.textContent.map((textBlock: any, index: any) => (
									<div key={index}>
										{textBlock.type === "headerText" && <h1>{textBlock.text}</h1>}
										{textBlock.type === "paragraph" && <p>{textBlock.text}</p>}
									</div>
								))}
							</div>
						</div>
					);
				}
				return null;
			}
			)}
		</div>
	);
}