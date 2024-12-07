export default function CategoryImages ({ categoryName, images })  {
    if (images.length === 0) return null;

    return (
        <>
            <div className={styles.largeimage}>
                <div className={styles.imagewrapper}>
                    <a href={images[0].filePath || "#"}>
                        <img src={images[0].previewImagePath} alt={images[0].blogTitle} />
                        {images[0].blogTitle && (
                            <p className={styles.imagecaption}>{images[0].blogTitle}</p>
                        )}
                    </a>
                </div>
            </div>
            <div className={styles.smallimages}>
                {images.slice(1, 5).map((image, imgIndex) => (
                    <div key={imgIndex} className={styles.imagewrapper}>
                        <a href={image.filePath || "#"}>
                            <img src={image.previewImagePath} alt={image.blogTitle} />
                            {image.blogTitle && (
                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                            )}
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
};
