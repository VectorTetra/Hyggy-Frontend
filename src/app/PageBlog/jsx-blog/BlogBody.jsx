"use client";
import React from "react";
import styles from "../css/blogstyle.module.css";

export default function BlogBody(props) {
    return (
        <div>
            {props.blogPage.blogBody.map((category, index) => (
                <div key={index} className={styles.categorycontainer}>
                    <h2 className={styles.h2} >{category.caption}</h2>
                    <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                            {category.imagesHome.length > 0 && (
                                <div className={styles.imagewrapper}>
                                    <img src={category.imagesHome[0].urlImages} alt={category.imagesHome[0].caption} />
                                    {category.imagesHome[0].caption && (
                                        <p className={styles.imagecaption}>{category.imagesHome[0].caption}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.smallimages}>
                            {category.imagesHome.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex} className={styles.smallimage}>
                                    <div className={styles.imagewrapper}>
                                        <a href={image.urlPage}>
                                            <img src={image.urlImages} alt={image.caption} />
                                            {image.caption && (
                                                <p className={styles.imagecaption}>{image.caption}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

