// import { useState } from 'react';
// import Image from 'next/image';
// import styles from '../css/CardCarousel.module.css';

// export default function CardCarousel({ cards }) {
// 	const [currentIndex, setCurrentIndex] = useState(0);

// 	const nextSlide = () => {
// 		setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
// 	};

// 	const prevSlide = () => {
// 		setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
// 	};

// 	return (
// 		<div className={styles.carousel}>
// 			<button className={styles.prevButton} onClick={prevSlide}>
// 				&lt;
// 			</button>

// 			<div className={styles.slide}>
// 				<Image
// 					width={400}
// 					height={300}
// 					src={cards[currentIndex].imageSrc}
// 					alt={cards[currentIndex].title}
// 				/>
// 				<div className={styles.cardTitle}>{cards[currentIndex].title}</div>
// 			</div>

// 			<button className={styles.nextButton} onClick={nextSlide}>
// 				&gt;
// 			</button>
// 		</div>
// 	);
// }


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import '../css/CardCarousel.css'; // Імпортуйте ваш CSS файл

export default function CardCarousel({ cards }) {
	const sliderRef = useRef<Slider | null>(null);

	const settings = {
		infinite: true,
		//autoplay: true,
		//autoplaySpeed: 3000,
		slidesToShow: 3,
		slidesToScroll: 1,
		// dots: true,
		arrows: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					arrows: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					arrows: true,
				},
			},
		],
	};

	return (
		<div className="carouselWrapper">
			<Slider ref={sliderRef} {...settings}>
				{cards.map((card, index) => (
					<div key={index} className="slide">
						<Image
							width={400}
							height={300}
							src={card.imageSrc}
							alt={card.title}
							className="cardImage"
						/>
						<div className="cardTitle">{card.title}</div>
					</div>
				))}
			</Slider>
		</div>
	);
}
