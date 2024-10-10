import Image from 'next/image';
import styles from '../css/LinkedStickerBar.module.css';
import Link from 'next/link';

export default function LinkedStickerBar(props: any) {
	return (
		<div className={styles.stickerBar} style={{ backgroundColor: props.backgroundColor || "white" }}>
			{props.stickers.map((sticker: any) => {
				return (
					<Link href={sticker.href} key={sticker.id} className={styles.sticker}>
						<Image
							src={sticker.stickerSrc}
							alt={sticker.stickerAlt}
							width={props.width || 26}
							height={props.height || 26}
						/>
						<span className={styles.stickerText}>{sticker.stickerAlt}</span>
					</Link>
				);
			})}
		</div>
	);
}
