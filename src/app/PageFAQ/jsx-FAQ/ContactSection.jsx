"use client";
import React from "react";
import styles from "../css/FAQStyles.module.css";
import Link from "next/link";

export default function ContactSection(props) {
    return (
        <div className={styles.contactsection}>
            <div className={styles.captionworkstyle}><h2>Контакти</h2></div>
            <hr></hr>
            <div>
                {props.faqPage.infoworkwithclients.map((item, index) => (
                    <div key={index} className={styles.contactitem}>
                        <img src={item.urlImages} alt="Image" className={styles.contactimage} />
                        <div className={styles.contactcontent}>
                            <Link href={item.urlPage}>
                                <div className={styles.contentstyle} >{item.contentwork}</div>
                            </Link>
                            <div className={styles.textstyle} >{item.text}</div>
                            <hr className={styles.hr} ></hr>
                        </div>
                    </div>
                ))}
                <div>
                    <div className={styles.captionworkstyle} >{props.faqPage.captionOpen}</div>
                    {props.faqPage.worktime.map((item, index) => (
                        <div key={index}>
                            <div className={styles.opentime}>{item.weekday}</div>
                            <div className={styles.opentime}>{item.weekend}</div>
                        </div>
                    ))}
                    <div className={styles.shopgo}>
                        <Link href={props.faqPage.urlpage}>
                            <div className={styles.adaptivurl}>{props.faqPage.captionshop}</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

