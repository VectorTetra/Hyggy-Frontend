"use client";
import data from './structure.json';
import HeaderImage from './tsx/HeaderImage';
import TextBlock from './tsx/TextBlock'; // Імпортуємо новий компонент
import StickerBar from './tsx/StickerBar'; // Імпортуємо новий компонент
import CardCarousel from './tsx/CardCarousel';
import BlockArticle from './tsx/BlockArticle';
import LinkedStickerBar from './tsx/LinkedStickerBar';
import styles from './page.module.css';
import Layout from '../sharedComponents/Layout';

export default function WorkPage(props: any) {
	return (
		<Layout headerType='null'>
			<div className={styles.pageContainer}>
				{data.map((item: any) => {
					if (item.type === "imageHeader") {
						return <HeaderImage item={item} key={item.id} />;
					}
					if (item.type === "textblock") {
						return <TextBlock content={item.textContent} key={item.id} />;
					}
					if (item.type === "stickerBar") {
						return <StickerBar stickers={item.stickers} key={item.id} width={item.width} height={item.height} backgroundColor={item.backgroundColor} />;
					}
					if (item.type === "cardCarousel") {
						return <CardCarousel cards={item.cards} key={item.id} />;
					}
					if (item.type === "blockArticle") {
						return <BlockArticle blocks={item.blocks} key={item.id} />;
					}
					if (item.type === "linkedStickerBar") {
						return <LinkedStickerBar stickers={item.stickers} key={item.id} width={item.width} height={item.height} backgroundColor={item.backgroundColor} />;
					}
					return null; // Для випадків, коли тип не співпадає
				})}
			</div>
		</Layout>
	);
}
