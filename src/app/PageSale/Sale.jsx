"use client";
import React from "react";
import styles from "./css/sale.module.css";

export default function Sale({ saleData }) {

    const images = saleData.urlimage;

    return (
        <div className={styles.headcontainer}>
            <img className={styles.bigimage} src={saleData.urlImageHead} alt="Акция" />
            <div className={styles.contenttext}>{saleData.content}</div>

            <div className={styles.captiontext}>
                <div className={styles.contenttext}>
                    {saleData.text}
                </div>
                <div className={styles.imagerow}>
                    {images.map((imageObj, index) => (
                        <div key={index} className={styles.imageContainer}>
                            <div className={styles.imageText}>{imageObj.text}</div>
                            <img
                                src={imageObj.photo}
                                alt={`Акція ${index + 1}`}
                                className={styles.image}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}