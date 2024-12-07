"use client";
import React, { useState } from "react";
import styles from "../css/blogstyle.module.css";
import Link from "next/link";
import { useCurrentCategory } from "@/store/blogStore";
import { Blog, useBlogs } from "@/pages/api/BlogApi";
import BlogList from "./BlogList";

export default function BlogBody() {
    const { currentCategory, currentCategory2 } = useCurrentCategory();

    const { data: blogs = [] } = useBlogs();

    const groupedBlogs: Record<string, Blog[]> = blogs.reduce((acc, blog) => {
        const categoryId = blog.blogCategory1Id;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(blog);
        return acc;
    }, {} as Record<string, Blog[]>);

    const groupedBlogs2: Record<string, Blog[]> = blogs.reduce((acc, blog) => {
        const categoryId = blog.blogCategory2Id;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(blog);
        return acc;
    }, {} as Record<string, Blog[]>);

    console.log(groupedBlogs2);

    return (
        <div className={styles.headcontainer}>
            {currentCategory2 === "" ? (
                Object.entries(groupedBlogs).map(([categoryId, blogs]) => (
                    (currentCategory === blogs[0]?.blogCategory1Name || currentCategory === "") &&
                    <BlogList key={categoryId} blogs={blogs} />
                ))
            ) : (
                Object.entries(groupedBlogs2).map(([categoryId, blogs]) => (
                    (currentCategory2 === blogs[0]?.blogCategory2Name) &&
                    <BlogList key={categoryId} blogs={blogs} />
                ))
            )}
        </div>
    );
}