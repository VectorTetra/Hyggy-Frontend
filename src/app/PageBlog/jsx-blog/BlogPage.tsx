"use client"

import React, { useState } from "react";
import styles from "../css/blogstyle.module.css";
import BlogMenu from "./BlogMenu";
import BlogBody from "./BlogBody";


export default function BlogPage(props) {

    return (
        <div>
            <h2 className={styles.captionH2} >{props.blogPage.caption}</h2>
            <div className={styles.captionText} >{props.blogPage.text}</div>
            <hr></hr>

            <BlogMenu />
            <hr></hr>
            <BlogBody />
        </div>

    )
}