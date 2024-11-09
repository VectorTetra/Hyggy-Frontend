import { Ware } from "@/pages/api/WareApi";
import styles from "../page.module.css";
import { Customer } from "@/pages/api/CustomerApi";
import FavoriteButton from "./FavoriteButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

interface ProductImageCarouselProps {
    product: Ware;
    customer: Customer | null;
    toggleFavorite: (productId: number) => void;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ product, customer, toggleFavorite }) => {
    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        adaptiveHeight: true,
    };

    return (
        <div className={styles.carouselWrapper}>
            <FavoriteButton
                className={styles.favoriteButton}
                productId={product.id}
                isFavorite={customer?.favoriteWareIds.includes(product.id) ?? false}
                toggleFavorite={toggleFavorite}
            />

            <Slider {...settings}>
                {product.imagePaths && product.imagePaths.map((image, index) => (
                    <div key={index} className={styles.carouselSlide}>
                        <Image
                            src={image}
                            alt={`Product Image ${index + 1}`}
                            width={500}
                            height={500}
                            className={styles.carouselImage}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductImageCarousel;
