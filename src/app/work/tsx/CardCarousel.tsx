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
		arrows: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					infinite: true,
					slidesToShow: 2,
					arrows: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					infinite: true,
					slidesToShow: 1,
					arrows: true,
				},
			},
		],
	};

	return (
		<div className="workpageCarousel">
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
		</div>
	);
}
