"use client";
import { useEffect, useState } from "react";
import htmlReactParser from "html-react-parser";
import { Blog, getJsonConstructorFile, useBlogs } from "@/pages/api/BlogApi";
import { useParams } from "next/navigation";
import styles from "./css/blogIndividual.module.css";
import Image from "next/image";
import ReactQuill, { Quill } from 'react-quill';
//import 'react-quill/dist/quill.snow.css';

// Функція для заміни класів на стилі з модуля
const replaceClassesWithModuleStyles = (html: string) => {
    return html.replace(/class="([^"]+)"/g, (match, className) => {
        const classNames = className.split(" ");
        const newClassNames = classNames
            .map((name) => styles[name] || name) // Замінюємо на відповідний клас з модуля, якщо він існує
            .join(" ");
        return `class="${newClassNames}"`;
    });
};

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
                                {item.contentType === "text" && (
                                    <div className={`${styles.contenttext} ${styles.captiontext} ${styles["ql-editor"]}`}>
                                        {htmlReactParser(replaceClassesWithModuleStyles(item.content))}
                                    </div>
                                )}
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
                                {item.contentType === "mixed" && (
                                    <div className={`${styles.flexContainer} ${styles.mixedTextPhotoContainer}`}>
                                        <div className={`${styles.contenttext} ${styles.captiontext} ${styles["ql-editor"]}`}
                                            style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                                            {htmlReactParser(replaceClassesWithModuleStyles(item.content.text))}
                                        </div>
                                        <div className={styles.imageWrapper}
                                            style={{ display: "flex", flex: 0.33 }}>
                                            <Image
                                                src={item.content.photos[0]}
                                                alt={`Image 1`}
                                                layout="intrinsic"
                                                width={400}
                                                height={300}
                                                className={`${styles.image} ${styles.imageMixed}`}
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div >
        )
    );
}

