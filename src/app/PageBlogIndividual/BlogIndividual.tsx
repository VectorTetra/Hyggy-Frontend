"use client";
import { Blog, getJsonConstructorFile, useBlogs } from "@/pages/api/BlogApi";
import { useParams } from "next/navigation";
import styles from "./css/blogIndividual.module.css";
import { useEffect, useState } from "react";

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
                <div>
                    {articleItems !== null &&
                        articleItems.map((item, index) => (
                            <div className={styles.captiontext} key={index}>
                                {item.caption && <h2 className={styles.h2}>{item.caption}</h2>}
                                <div
                                    className={styles.contenttext}
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                                {item.urlimage1 || item.urlimage2 ? (
                                    <div className={styles.imagerow}>
                                        {item.urlimage1 && <img src={item.urlimage1} alt="Image 1" />}
                                        {item.urlimage2 && <img src={item.urlimage2} alt="Image 2" />}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                </div>
            </div>
        )
    );
}