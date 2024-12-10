"use client";
import { useBlogs } from "@/pages/api/BlogApi";
import { useCurrentCategory } from "@/store/blogStore";
import styles from "../css/blogstyle.module.css";
import BlogList from "./BlogList";

export default function BlogBody() {
    const { currentCategory, currentCategory2 } = useCurrentCategory();

    const { data: blogs = [] } = useBlogs({
        SearchParameter: "Query",
        StringBlogCategory1Ids: (!currentCategory && !currentCategory2) ? "1|2|3" : null,
        BlogCategory1Id: currentCategory?.id || null,
        BlogCategory2Id: currentCategory2?.id || null,
    });
    const { data: blogsForHome = [] } = useBlogs({
        SearchParameter: "Query",
        BlogCategory1Id: 1,
    });
    const { data: blogsForSleep = [] } = useBlogs({
        SearchParameter: "Query",
        BlogCategory1Id: 2,
    });
    const { data: blogsForGarden = [] } = useBlogs({
        SearchParameter: "Query",
        BlogCategory1Id: 3,
    });
    console.log("blogs in BlogBody", blogs);
    if (!currentCategory && !currentCategory2) {
        return (
            <div className={styles.headcontainer}>
                <BlogList blogs={blogsForHome} />
                <BlogList blogs={blogsForSleep} />
                <BlogList blogs={blogsForGarden} />
            </div>
        )
    }
    return (
        <div className={styles.headcontainer}>
            <BlogList blogs={blogs} title={currentCategory2 !== null ? currentCategory2.name : currentCategory?.name} />
        </div>
    );
}