
import React from "react";
import styles from "./css/blogIndividual.module.css";

export default function BlogIndividual(props) {
    return (
        <div className={styles.headcontainer} >
            <img className={styles.bigimage} src={props.individualPage.urlImageHead} alt="Image" />
            <h1>{props.individualPage.caption}</h1>
            <div className={styles.contenttext} >{props.individualPage.content}</div>
            <div>
                {props.individualPage.list.map((item, index) => (
                    <div className={styles.captiontext} key={index}>
                        <h2>{item.caption}</h2>
                        <div className={styles.contenttext}>
                            {item.content}
                            <div className={styles.imagerow}>
                                <img src={item.urlimage1} alt="Image" />
                                <img src={item.urlimage2} alt="Image" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}