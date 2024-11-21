"use client";
import { Blog, getJsonConstructorFile, useBlogs } from "@/pages/api/BlogApi";
import { useParams } from "next/navigation";
import styles from "./css/blogIndividual.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BlogIndividual(props) {
    const params = useParams();
    const id = Number(params?.id);
    const { data: articles = [], isLoading: isArticlesLoading, isSuccess: isArticlesSuccess } = useBlogs({
        SearchParameter: "Query",
        Id: id
    });
    const [article, setArticle] = useState<Blog | null>(null);
    const [articleItems, setArticleItems] = useState<any[] | null>(null);
    useEffect(() => {
        const fetchArticleItems = async () => {
            if (isArticlesSuccess && articles.length > 0) {
                setArticle(articles[0]);
                if (articles[0].filePath && articles[0].filePath.length > 0) {
                    try {
                        const ctorFile = await getJsonConstructorFile(articles[0].filePath);
                        if (Array.isArray(ctorFile) && ctorFile.length > 0) {
                            setArticleItems(ctorFile);
                        }
                    } catch (error) {
                        console.error("Error parsing article items", error);
                    }
                }
            }
        };
        fetchArticleItems();
    }, [isArticlesSuccess, articles]);

    if (isArticlesLoading || article === null) {
        return null;
    }
    return (
        article !== null && (
            <div className={styles.headcontainer}>
                <img
                    className={styles.bigimage}
                    src={article.previewImagePath}
                    alt={article.blogTitle || "Blog Image"}
                />
                <h1 className={styles.h1}>{article.blogTitle}</h1>
                <div className={styles.blogItemsСontainer}>
                    {articleItems !== null &&
                        articleItems.map((item, index) => (
                            <div key={index}>
                                {item.caption && <h2 className={styles.h2}>{item.caption}</h2>}
                                {item.contentType === "text" && <div
                                    className={`${styles.contenttext} ${styles.captiontext}`}
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />}
                                {item.contentType === "image" && (
                                    <div className={styles.flexContainer}>
                                        {item.content.map((imageUrl: string, imgIndex: number) => (
                                            <div key={imgIndex} className={styles.imageWrapper}>
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Image ${imgIndex + 1}`}
                                                    layout="intrinsic"
                                                    width={400}
                                                    height={300}
                                                    className={`${styles.image} ${item.content.length > 1 ? styles.imageSmall : styles.imageBig}`}
                                                    unoptimized
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}



                            </div>
                        ))}
                </div>
            </div>
        )
    );
}