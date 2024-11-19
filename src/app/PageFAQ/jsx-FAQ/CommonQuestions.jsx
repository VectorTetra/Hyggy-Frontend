"use client";
import React from "react";
import styles from "../css/FAQStyles.module.css";
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
export default function CommonQuestions(props) {
    const [activeCaption, setActiveCaption] = useQueryState("activeCaption", { scroll: false, history: "replace", shallow: true });
    const [activeQuestion, setActiveQuestion] = useQueryState("activeQuestion", { scroll: false, history: "replace", shallow: true });
    const handleTitleClick = (queryFilter, id) => {
        setActiveCaption(queryFilter, { history: "replace" });
        setActiveQuestion(id, { history: "replace" });
    };

    const titles = props.faqPage.answer.flatMap(item =>
        item.subquestions.flatMap(subitem =>
            subitem.questions.map(question => ({
                title: question.title,
                content: question.content,
                queryFilter: item.queryFilter,
                id: question.id
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
            <h3>Найбільш поширені питання</h3>
            <div className={styles.questionscontainer}>
                <div className={styles.questionscolumnl}>
                    {firstColumn.map((item) => (
                        <div
                            key={item.id}
                            className={styles.questiontitle}
                            onClick={() => handleTitleClick(item.queryFilter, item.id)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
                <div className={styles.questionscolumnr}>
                    {secondColumn.map((item) => (
                        <div
                            key={item.id}
                            className={styles.questiontitle}
                            onClick={() => handleTitleClick(item.queryFilter, item.id)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

