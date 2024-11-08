import styles from "../page.module.css";
export default function ProductImageGallery({ product }) {
    return <div className={styles.imageGallery}>
        <div className={styles.mainImageContainer}>
            {product.imagePaths && product.imagePaths.length > 0 &&
                <div className={styles.mainImage}>
                    <img src={product.imagePaths[0]} alt={product.imagePaths[0]} />
                </div>}
            {product.imagePaths && product.imagePaths.length > 1 && <div className={styles.mainImage}>
                <img src={product.imagePaths[1]} alt={product.imagePaths[1]} />
            </div>}
        </div>
        <div className={styles.thumbnails}>
            {product.imagePaths && product.imagePaths.length > 2 && product.imagePaths.slice(2).map((thumb, index) => (
                <div key={index} className={styles.thumbnail}>
                    <img src={thumb} alt={`Thumbnail ${index + 1}`} />
                </div>
            ))}
        </div>
    </div>
}