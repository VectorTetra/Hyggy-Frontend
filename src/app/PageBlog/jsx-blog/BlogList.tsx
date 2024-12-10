import React from 'react';
import styles from "../css/blogstyle.module.css";
import Link from 'next/link';
const BlogList = ({ blogs = [], title }: { blogs: any[]; title?: string }) => {
    if (!blogs.length) return null;

    const mainBlog = blogs[0];
    const additionalBlogs = blogs.slice(1, 5);

    return (
        <div className={styles.categorycontainer}>
            <h2 className={styles.h2}>{title || mainBlog.blogCategory1Name}</h2>
            <div className={styles.categorycontent}>
                {/* Головне зображення */}
                {mainBlog && (
                    <div className={styles.largeimage}>
                        <div className={styles.imagewrapper}>
                            <Link href={"/PageBlogIndividual/" + mainBlog.id}>
                                <img
                                    src={mainBlog.previewImagePath}
                                    alt={mainBlog.blogTitle || "Blog Image"}
                                />
                                {mainBlog.blogTitle && (
                                    <p className={styles.imagecaption}>{mainBlog.blogTitle}</p>
                                )}
                            </Link>
                        </div>
                    </div>
                )}
                {/* Додаткові зображення */}
                <div className={styles.smallimages}>
                    {additionalBlogs.map((blog, index) => (
                        <div key={index} className={styles.imagewrapper}>
                            <Link href={"/PageBlogIndividual/" + blog.id}>
                                <img
                                    src={blog.previewImagePath}
                                    alt={blog.blogTitle || "Blog Image"}
                                />
                                {blog.blogTitle && (
                                    <p className={styles.imagecaption}>{blog.blogTitle}</p>
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
