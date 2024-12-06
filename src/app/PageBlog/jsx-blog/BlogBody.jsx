"use client";
import React from "react";
import styles from "../css/blogstyle.module.css";
import Link from "next/link";
import { useState } from "react";

export default function BlogBody() {
    //const {currentCategory,setCurrentCategory}= useBlogCategoryPageState();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [homeCategories, setHomeCategories] = useState([]);
    const [sleepCategories, setSleepCategories] = useState([]);
    const [garderCategories, setGardenCategories] = useState([]);

    // useEffect(() => {
    //     const fetchCategories = async () =>{
    //         const response = await getBlogMainCategories();
    //         console.log(response);
    //         setCategories(response);
    //     };
    //     const fetchHomeCategories = async () =>{
    //         const response = await getBlogs({
    //             SearchParameter: "Keyword",
    //             Keyword: "Для дому"
    //         })
    //         console.log(response);
    //         setHomeCategories(response);
    //     }
    //     const fetchSleepCategories = async () =>{
    //         const response = await getBlogs({
    //             SearchParameter: "Keyword",
    //             Keyword: "Все для сну"
    //         })
    //         console.log(response);
    //         setSleepCategories(response);
    //     }
    //     const fetchGardenCategories = async () =>{
    //         const response = await getBlogs({
    //             SearchParameter: "Keyword",
    //             Keyword: "Для саду"
    //         })
    //         console.log(response);
    //         setGardenCategories(response);
    //     }
    //     fetchCategories();
    //     fetchHomeCategories();
    //     fetchSleepCategories();
    //     fetchGardenCategories();
    // }, [currentCategory])




    const getImages = async (categoryId) => {
        const response = await getBlogSubCatsByMainCat({
            SearchParameter: "BlogCategory1Id",
            BlogCategory1Id: categoryId
        });
        setSubCategories(response);
    }

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
                                        <Link prefetch={true} href={image.urlPage || "#"}>
                                            <img src={image.urlImages} alt={image.caption} />
                                            {image.caption && (
                                                <p className={styles.imagecaption}>
                                                    {image.caption}
                                                </p>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {currentCategory === "Для саду" && (
                <div className={styles.categorycontainer}>
                    <h2 className={styles.h2}>Для саду</h2>
                    <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                            {garderCategories.length > 0 && (
                                <div className={styles.imagewrapper}>
                                    <a href={garderCategories[0].filePath || "#"}>
                                        <img
                                            src={garderCategories[0].previewImagePath}
                                            alt={garderCategories[0].blogTitle}
                                        />
                                        {garderCategories[0].blogTitle && (
                                            <p className={styles.imagecaption}>
                                                {garderCategories[0].blogTitle}
                                            </p>
                                        )}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className={styles.smallimages}>
                            {garderCategories.slice(1, 5).map((image, imgIndex) => (
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
            )}
        </div>
    );
}