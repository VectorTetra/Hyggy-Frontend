"use client";
import React from "react";
import styles from "../css/blogstyle.module.css";
import Link from "next/link";

export default function BlogBody(props) {
    return (
        <div className={styles.headcontainer}>
            {props.blogPage.blogBody.map((category, index) => (
                <div key={index} className={styles.categorycontainer}>
                    <h2 className={styles.h2}>{category.caption}</h2>
                    <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                            {category.imagesHome.length > 0 && (
                                <div className={styles.imagewrapper}>
                                    <Link prefetch={true} href={category.imagesHome[0].urlPage || "#"}>
                                        <img src={category.imagesHome[0].urlImages} alt={category.imagesHome[0].caption} />
                                        {category.imagesHome[0].caption && (
                                            <p className={styles.imagecaption1}>{category.imagesHome[0].caption}</p>
                                        )}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className={styles.smallimages}>
                            {category.imagesHome.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <div className={styles.imagewrapper}>
<<<<<<< HEAD
                                        <Link href={image.urlPage || "#"}>
                                            <img className={styles.image} src={image.urlImages} alt={image.caption} />
=======
                                        <Link prefetch={true} href={image.urlPage || "#"}>
                                            <img src={image.urlImages} alt={image.caption} />
>>>>>>> Viktor-Page-Ware-Finishing
                                            {image.caption && (
                                                <p className={styles.imagecaption}>{image.caption}</p>
                                            )}
                                        </Link>
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
