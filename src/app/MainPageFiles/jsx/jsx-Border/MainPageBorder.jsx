'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/pages/api/BlogApi';
import '../../styles/MainPageBorderCarusel.css';

export function MainPageBorder() {
    const sliderRef = useRef(null);

    // Используем useQuery для получения последних 3 акций
    const { data: sales = [] } = useBlogs(
        {
            SearchParameter: "Query",
            PageNumber: 1,
            PageSize: 3,
            Sorting: "IdDesc",
            BlogCategory1Name: "Акції"
        }
    );

    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className="carouselWrapper1">
            <Slider ref={sliderRef} {...settings}>
                {Array.isArray(sales) && sales.length > 0 && sales.map((card, index) => (
                    <div key={index} className="slide">
                        <Link href={`/PageBlogIndividual/${card.id}`}>
                            <Image
                                width={400}
                                height={300}
                                src={card.previewImagePath}
                                alt={card.blogTitle}
                                className="cardImage1"
                            />
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
