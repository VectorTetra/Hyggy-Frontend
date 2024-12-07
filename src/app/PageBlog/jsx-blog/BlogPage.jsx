"use client"

import React, { useState } from "react";
import styles from "../css/blogstyle.module.css";
import BlogMenu from "./BlogMenu";
import BlogBody from "./BlogBody";


export default function BlogPage(props) {
    const [currentCategory, setCurrentCategory] = useState("");
    
    return (
        <div>
            <h2 className={styles.captionH2} >{props.blogPage.caption}</h2>
            <div className={styles.captionText} >{props.blogPage.text}</div>
            <hr></hr>

            <BlogMenu blogPage={props.blogPage} />
            <hr></hr>
            <BlogBody blogPage={props.blogPage} />
        </div>

    )
}