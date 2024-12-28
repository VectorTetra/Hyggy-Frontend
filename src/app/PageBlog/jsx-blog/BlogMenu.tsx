"use client";
import { useBlogsCategories1 } from "@/pages/api/BlogCategory1Api";
import { useBlogCategories2 } from "@/pages/api/BlogCategory2Api";
import { useCurrentCategory } from "@/store/blogStore";
import { useEffect, useMemo } from "react";
import styles from "../css/blogstyle.module.css";
import clsx from "clsx";

export default function BlogMenu() {
    const { currentCategory, setCurrentCategory, setCurrentCategory2 } = useCurrentCategory();

    const { data: categories = [] } = useBlogsCategories1({
        SearchParameter: "Query",
        StringIds: "1|2|3",
    });

    const { data: categories2 = [] } = useBlogCategories2({
        SearchParameter: "Query",
        StringIds: categories.flatMap(c => c.blogCategory2Ids.map(bc2 => bc2)).join("|"),
    }, categories.length > 0);

    // Визначення підкатегорій на основі вибраної категорії
    const subCategories = useMemo(() => {
        return categories2.filter(cat => cat.blogCategory1Id === categories.find(c => c === currentCategory)?.id);
    }, [categories2, categories, currentCategory]);
    console.log("currentCategory:", currentCategory);
    console.log("Selected category ID:", categories.find(c => c === currentCategory)?.id);
    console.log("Filtered subcategories:", subCategories);
    console.log("StringIds:", categories.flatMap(c => c.blogCategory2Ids.map(bc2 => bc2)).join("|"));

    return (
        <div>
            {/* Основне меню */}
            <div className={styles.menucontainer}>
                {categories.map((category, index) => (
                    index !== 3 && (
                        <button
                            key={category.id}
                            onClick={() => {
                                setCurrentCategory(category);
                                setCurrentCategory2(null);
                            }}
                            className={clsx(styles.menuitem, {
                                [styles.selectedMenuItem]: currentCategory === category,
                            })}
                        >
                            {category.name}
                        </button>
                    )
                ))}
            </div>

            {/* Підкатегорії */}
            {subCategories.length > 0 && (
                <div>
                    <hr />
                    <div className={styles.imagescontainer}>
                        {subCategories.map(subCat => (
                            <div key={subCat.id} className={styles.imageitem}>
                                <button onClick={() => setCurrentCategory2(subCat)}>
                                    <img src={subCat.previewImagePath} alt={subCat.name} />
                                    <div className={styles.textmenu}>{subCat.name}</div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
