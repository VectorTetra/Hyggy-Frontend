import React, { useEffect, useState } from 'react'
import styles from "../css/blogstyle.module.css";

const BlogList = ({ blogs }) => {
    const [currBlogs, setCurrBlogs] = useState<any>([]);

    useEffect(() => {
        setCurrBlogs(blogs || []);
    }, [blogs]);

    return (
        <div className={styles.categorycontainer}>
            <h2 className={styles.h2}>{currBlogs[0] && currBlogs[0].blogCategory1Name
            }</h2>
            <div className={styles.categorycontent}>
                <div className={styles.largeimage}>
                    {currBlogs.length > 0 && currBlogs[0] && (
                        <div className={styles.imagewrapper}>
                            <a href={currBlogs[0].filePath || "#"}>
                                <img
                                    src={currBlogs[0].previewImagePath}
                                    alt={currBlogs[0].blogTitle}
                                />
                                {currBlogs[0].blogTitle && (
                                    <p className={styles.imagecaption}>
                                        {currBlogs[0].blogTitle}
                                    </p>
                                )}
                            </a>
                        </div>
                    )}
                </div>
                <div className={styles.smallimages}>
                    {currBlogs && currBlogs.slice(1, 5).map((image, imgIndex) => (
                        <div key={imgIndex}>
                            <div className={styles.imagewrapper}>
                                <a href={image.filePath || "#"}>
                                    <img
                                        src={image.previewImagePath}
                                        alt={image.blogTitle}
                                    />
                                    {image.blogTitle && (
                                        <p className={styles.imagecaption}>
                                            {image.blogTitle}
                                        </p>
                                    )}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlogList