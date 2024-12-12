import { WareGetDTO } from "@/pages/api/WareApi";
import styles from "@/app/ware/css/ProductImageCarousel.module.css";
import { Customer } from "@/pages/api/CustomerApi";
import FavoriteButton from "../../sharedComponents/FavoriteButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useFavoriteWare } from "@/app/sharedComponents/methods/useFavoriteWare";

interface ProductImageCarouselProps {
    product: WareGetDTO;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ product }) => {
    const { toggleFavoriteWare, isFavorite } = useFavoriteWare();
    const settings = {
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        adaptiveHeight: true
    };

    return (
        <div className={styles.carouselWrapper}>
            <FavoriteButton
                className={styles.favoriteButton}
                productId={product.id}
                isFavorite={isFavorite(product.id)}
                toggleFavorite={toggleFavoriteWare}
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
