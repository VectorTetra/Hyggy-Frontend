"use client";
import { getBlogs } from "@/pages/api/BlogApi";
import { getBlogMainCategories } from "@/pages/api/BlogMainCategory";
import { getBlogSubCats, getBlogSubCatsByMainCat } from "@/pages/api/BlogSubCategory";
import React, { useEffect, useState } from "react";
import styles from "../css/blogstyle.module.css";

export default function BlogBody({ currentCategory, setCurrentCategory }) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [homeCategories, setHomeCategories] = useState([]);
    const [sleepCategories, setSleepCategories] = useState([]);
    const [garderCategories, setGardenCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () =>{
            const response = await getBlogMainCategories();
            console.log(response);
            setCategories(response);
        };
        const fetchHomeCategories = async () =>{
            const response = await getBlogs({
                SearchParameter: "Keyword",
                Keyword: "Для дому"
            })
            console.log(response);
            setHomeCategories(response);
        }
        const fetchSleepCategories = async () =>{
            const response = await getBlogs({
                SearchParameter: "Keyword",
                Keyword: "Все для сну"
            })
            console.log(response);
            setSleepCategories(response);
        }
        const fetchGardenCategories = async () =>{
            const response = await getBlogs({
                SearchParameter: "Keyword",
                Keyword: "Для саду"
            })
            console.log(response);
            setGardenCategories(response);
        }
        fetchCategories();
        fetchHomeCategories();
        fetchSleepCategories();
        fetchGardenCategories();
    }, [currentCategory])

//     useEffect(() => {
//         // Групування об'єктів за blogCategory1Id
// const groupedCategories = subCategories.reduce((acc, item) => {
//     if (!acc[item.blogCategory1Id]) {
//         acc[item.blogCategory1Id] = [];
//     }
//     acc[item.blogCategory1Id].push(item);
//     return acc;
// }, {});

// // Вибір перших 5 об'єктів для кожної групи
// const homeImages = groupedCategories[1]?.slice(0, 5) || [];
// const sleepImages = groupedCategories[2]?.slice(0, 5) || [];
// const gardenImages = groupedCategories[3]?.slice(0, 5) || [];

// setHomeImages(homeImages);
// setSleepImages(sleepImages);
// setGardenImages(gardenImages);
//     }, [subCategories])


    const getImages = async (categoryId) =>{
        const response = await getBlogSubCatsByMainCat({
            SearchParameter: "BlogCategory1Id",
            BlogCategory1Id: categoryId
        });    
        setSubCategories(response);
    }
    
    return (
        <div className={styles.headcontainer}>
            {currentCategory === "" && categories.slice(0,3).map((category, index) => (               
                <div key={index} className={styles.categorycontainer}>
                    <h2 className={styles.h2}>{category.name
}</h2>
                    <div className={styles.categorycontent}>
                        {category.name === "Для дому" && 
                        <>
                            <div className={styles.largeimage}>
                            {homeCategories.length > 0  && (
                                <div className={styles.imagewrapper}>
                                    <a href={homeCategories[0].filePath
 || "#"}>
                                        <img src={homeCategories[0].previewImagePath
} alt={homeCategories[0].blogTitle} />
                                        {homeCategories[0].blogTitle && (
                                            <p className={styles.imagecaption}>{homeCategories[0].blogTitle}</p>
                                        )}
                                    </a>
                                </div>
                            )}
                        </div> 

                        <div className={styles.smallimages}>
                            {homeCategories.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <div className={styles.imagewrapper}>
                                        <a href={image.filePath || "#"}>
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
}
                        </div>
                                            
                        <div className={styles.categorycontent}>
                        {category.name === "Все для сну" && 
                        <>
                            <div className={styles.largeimage}>
                            {sleepCategories.length > 0  && (
                                <div className={styles.imagewrapper}>
                                    <a href={sleepCategories[0].filePath
 || "#"}>
                                        <img src={sleepCategories[0].previewImagePath
} alt={sleepCategories[0].blogTitle} />
                                        {sleepCategories[0].blogTitle && (
                                            <p className={styles.imagecaption}>{sleepCategories[0].blogTitle}</p>
                                        )}
                                    </a>
                                </div>
                            )}
                        </div> 
                        
                        <div className={styles.smallimages}>
                            {sleepCategories.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <div className={styles.imagewrapper}>
                                        <a href={image.filePath || "#"}>
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
}
                        </div>
                        <div className={styles.categorycontent}>
                        {category.name === "Для саду" && 
                        <>
                            <div className={styles.largeimage}>
                            {garderCategories.length > 0  && (
                                <div className={styles.imagewrapper}>
                                    <a href={garderCategories[0].filePath
 || "#"}>
                                        <img src={garderCategories[0].previewImagePath
} alt={garderCategories[0].blogTitle} />
                                        {garderCategories[0].blogTitle && (
                                            <p className={styles.imagecaption}>{garderCategories[0].blogTitle}</p>
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
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
}
                    </div>
                </div>
            ))}
            {currentCategory === "Для дому" && (
                <div className={styles.categorycontainer}>
                <h2 className={styles.h2}>Для дому</h2>
                <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                        {homeCategories.length > 0  && (
                            <div className={styles.imagewrapper}>
                                <a href={homeCategories[0].filePath
|| "#"}>
                                    <img src={homeCategories[0].previewImagePath
} alt={homeCategories[0].blogTitle} />
                                    {homeCategories[0].blogTitle && (
                                        <p className={styles.imagecaption}>{homeCategories[0].blogTitle}</p>
                                    )}
                                </a>
                            </div>
                        )}
                    </div> 
                    <div className={styles.smallimages}>
                            {homeCategories.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <div className={styles.imagewrapper}>
                                        <a href={image.filePath || "#"}>
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                  
                    </div>
                    </div>
            )}
            {currentCategory === "Все для сну" && (
                <div className={styles.categorycontainer}>
                <h2 className={styles.h2}>Все для сну</h2>
                <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                        {sleepCategories.length > 0  && (
                            <div className={styles.imagewrapper}>
                                <a href={sleepCategories[0].filePath
|| "#"}>
                                    <img src={sleepCategories[0].previewImagePath
} alt={sleepCategories[0].blogTitle} />
                                    {sleepCategories[0].blogTitle && (
                                        <p className={styles.imagecaption}>{sleepCategories[0].blogTitle}</p>
                                    )}
                                </a>
                            </div>
                        )}
                    </div> 
                    <div className={styles.smallimages}>
                            {sleepCategories.slice(1, 5).map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <div className={styles.imagewrapper}>
                                        <a href={image.filePath || "#"}>
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                  
                    </div>
                    </div>
            )}
            {currentCategory === "Для саду" && (
                <div className={styles.categorycontainer}>
                <h2 className={styles.h2}>Для саду</h2>
                <div className={styles.categorycontent}>
                        <div className={styles.largeimage}>
                        {garderCategories.length > 0  && (
                            <div className={styles.imagewrapper}>
                                <a href={garderCategories[0].filePath
|| "#"}>
                                    <img src={garderCategories[0].previewImagePath
} alt={garderCategories[0].blogTitle} />
                                    {garderCategories[0].blogTitle && (
                                        <p className={styles.imagecaption}>{garderCategories[0].blogTitle}</p>
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
                                            <img src={image.previewImagePath} alt={image.blogTitle} />
                                            {image.blogTitle && (
                                                <p className={styles.imagecaption}>{image.blogTitle}</p>
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
