import Image from 'next/image';
import styles from '../css/StickerBar.module.css';

export default function StickerBar(props: any) {
	return (
		<div className={styles.stickerBar}>
			{props.stickers.map((sticker: any) => {
				return (
					<div key={sticker.id} className={styles.sticker}>
						<Image
							src={sticker.stickerSrc}
							alt={sticker.stickerAlt}
							width={26}
							height={26}
						/>
						<span className={styles.stickerText}>{sticker.stickerAlt}</span>
					</div>
				);
			})}
		</div>
	);
}
