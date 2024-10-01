import styles from '../css/TextBlock.module.css';

interface ContentItem {
	type: string;
	text: string;
}

interface TextBlockProps {
	content: ContentItem[];
}

export default function TextBlock({ content }: TextBlockProps) {
	return (
		<div className={styles.textblock}>
			{content.map((contentItem: any) => {
				if (contentItem.type === "headerText") {
					return <h1 className={styles.headerText} key={contentItem.text}>{contentItem.text}</h1>;
				}
				if (contentItem.type === "paragraph") {
					return <p className={styles.paragraph} key={contentItem.text}>{contentItem.text}</p>;
				}
				if (contentItem.type === "boldspan") {
					return <div className={styles.boldspan} key={contentItem.text}>{contentItem.text}</div>;
				}
				if (contentItem.type === "span") {
					return <div className={styles.span} key={contentItem.text}>{contentItem.text}</div>;
				}
				if (contentItem.type === "boldparagraph") {
					return <p className={styles.boldparagraph} key={contentItem.text}>{contentItem.text}</p>;
				}
				return null;
			})}
		</div>
	);
}
