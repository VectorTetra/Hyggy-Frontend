"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/blogstyle.module.css";
import Link from "next/link";

export default function BlogMenu(props) {
    const [images, setImages] = React.useState([]);
    const [selectedCaption, setSelectedCaption] = useState(""); // Для хранения выбранного caption
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

    const handleImageClick = (caption) => {
        router.push(`/PageBlogCategory?caption=${encodeURIComponent(caption)}`);
    };

    React.useEffect(() => {
        loadImages('Для дому');
    }, []);

    return (
        <div>
            <div className={styles.menucontainer}>
                {props.blogPage.blogmenu.map((item, index) => (
                    <Link
                        key={index}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            loadImages(item.captionMenu);
                            setSelectedCaption(item.captionMenu); // выбранный caption
                        }}
                        className={styles.menuitem}
                    >
                        {item.captionMenu}
                    </Link>
                ))}
            </div>
            <hr />
            <div className={styles.imagescontainer}>
                {images.map((item, index) => (
                    <div key={index} className={styles.imageitem}>
                        <Link
                            href="#"
                            onClick={() => handleImageClick(item.caption)} // Передаем caption при клике
                        >
                            <img src={item.urlImages} alt={item.caption} />
                            <div className={styles.textmenu}>{item.caption}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
