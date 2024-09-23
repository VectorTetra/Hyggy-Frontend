"use client";
import React from "react";
import styles from "../css/FAQStyles.module.css";

export default function CommonQuestions(props) {
    const handleTitleClick = (index) => {
        props.onTitleClick(index);
    };

    const titles = props.faqPage.answer.flatMap(item =>
        item.subquestions.flatMap(subitem =>
            subitem.questions.map(question => ({
                title: question.title,
                content: question.content
            }))
        )
    );

    // Ограничиваем количество заголовков до 12
    const limitedTitles = titles.slice(0, 12);

    // Разделяем заголовки на две колонки
    const firstColumn = limitedTitles.slice(0, 6);
    const secondColumn = limitedTitles.slice(6);

    return (
        <div className={styles.commonquestions}>
            <h3>НАЙБІЛЬШ ПОШИРЕНІ ПИТАННЯ</h3>
            <div className={styles.questionscontainer}>
                <div className={styles.questionscolumn}>
                    {firstColumn.map((item, index) => (
                        <div
                            key={index}
                            className={styles.questiontitle}
                            onClick={() => handleTitleClick(index)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
                <div className={styles.questionscolumn}>
                    {secondColumn.map((item, index) => (
                        <div
                            key={index + 6}
                            className={styles.questiontitle}
                            onClick={() => handleTitleClick(index + 6)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

