"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/blogstyle.module.css";
import Link from "next/link";
import { useCurrentCategory } from "@/store/blogStore";
import { BlogCategory1Query, useBlogsCategories1 } from "@/pages/api/BlogCategory1Api";
import { useBlogCategories2 } from "@/pages/api/BlogCategory2Api";

export default function BlogMenu() {
    const [categoryId, setCategoryId] = useState();
    const { currentCategory, setCurrentCategory, currentCategory2, setCurrentCategory2 } = useCurrentCategory();
    const { data: categories = [] } = useBlogsCategories1();
    const { data: categories2 = [] } = useBlogCategories2();
    const [subCategories, setSubCategories] = useState<any>([]);


    useEffect(() => {
        const filteredCategories2 = categories2.filter(cat => cat.blogCategory1Id === categoryId);
        setSubCategories(filteredCategories2);
    }, [currentCategory])

    return (
        <div>
            <div className={styles.menucontainer}>
                {categories.map((category, index) => (
                    index !== 3 && (
                        <a
                            key={index}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentCategory(category.name);
                                setCurrentCategory2("");
                                setCategoryId(category.id)
                                //setSelectedCaption(category.name); // выбранный caption
                            }}
                            className={styles.menuitem}
                        >
                            {category.name}
                        </a>
                    )
                ))}
            </div>
            {subCategories.length > 0 &&
                <div>
                    <hr />
                    <div className={styles.imagescontainer}>
                        {subCategories.map((subCat, index) => (
                            <div key={index} className={styles.imageitem}>
                                <a
                                    href="#"
                                    onClick={() => setCurrentCategory2(subCat.name)}
                                >
                                    <img src={subCat.previewImagePath
                                    } alt={subCat.name} />
                                    <div className={styles.textmenu}>{subCat.name}</div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

