import styles from "../css/FAQStyles.module.css";
import React from "react";
import FAQQuestion from "./FAQQuestion.jsx";
export default function FAQSubQuestion({ subitem }) {

    return (
        <div key={subitem.id}>
            <div className={styles.faqcaption}>
                {subitem.caption}
            </div>
            {subitem.questions.map((question, qindex) => {
                return (
                    <FAQQuestion
                        key={qindex}
                        question={question}
                    />
                );
            })}
        </div>
    );
};
