"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/blogstyle.module.css";

export default function BlogMenu(props) {
    const [images, setImages] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("Для дому"); // Начальное состояние
    const router = useRouter();

    const loadImages = (category) => {
        let categoryKey = '';

        switch (category) {
            case 'Для дому':
                categoryKey = 'homemenu';
                break;
            case 'Для сну':
                categoryKey = 'forsleepmenu';
                break;
            case 'Для саду':
                categoryKey = 'forgardenmenu';
                break;
            default:
                categoryKey = 'homemenu';
        }

        const newImages = props.blogPage.menuimage[categoryKey] || [];
        setImages(newImages.map(item => ({
            ...item,
            urlImages: item.urlImagesHome || item.urlImagesSleep || item.urlImagesGarden
        })));
    };

    const handleMenuClick = (e, caption) => {
        e.preventDefault();
        setSelectedCaption(caption);
        loadImages(caption);
    };

    const handleImageClick = (caption) => {
        router.push(`/PageBlogCategory?caption=${encodeURIComponent(caption)}`);
    };

    return (
        <div>
            <div className={styles.menucontainer}>
                {props.blogPage.blogmenu.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        onClick={(e) => handleMenuClick(e, item.captionMenu)}
                        className={`${styles.menuitem} ${selectedCaption === item.captionMenu ? styles.activeMenu : ''}`}
                    >
                        {item.captionMenu}
                    </a>
                ))}
            </div>
            <hr />
            <div className={styles.imagescontainer}>
                {images.map((item, index) => (
                    <div key={index} className={styles.imageitem}>
                        <a
                            href="#"
                            onClick={() => handleImageClick(item.caption)}
                        >
                            <img src={item.urlImages} alt={item.caption} />
                            <div className={styles.textmenu}>{item.caption}</div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
