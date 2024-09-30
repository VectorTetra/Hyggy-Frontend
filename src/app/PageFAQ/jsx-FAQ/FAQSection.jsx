"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "../css/FAQStyles.module.css";

export default function FAQSection({ faqPage, activeTitleIndex }) {
    const [activeCaption, setActiveCaption] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const questionRefs = useRef({}); // Объект для хранения рефов для вопросов

    // Обновление активного заголовка и вопроса на основе activeTitleIndex
    useEffect(() => {
        if (activeTitleIndex !== null) {
            let currentIndex = 0;
            for (let i = 0; i < faqPage.answer.length; i++) {
                for (let j = 0; j < faqPage.answer[i].subquestions.length; j++) {
                    for (let k = 0; k < faqPage.answer[i].subquestions[j].questions.length; k++) {
                        if (currentIndex === activeTitleIndex) {
                            setActiveCaption(i);  // Устанавливаем активный заголовок
                            setActiveQuestion(`${i}-${j}-${k}`); // Устанавливаем уникальный идентификатор вопроса
                            return;
                        }
                        currentIndex++;
                    }
                }
            }
        }
    }, [activeTitleIndex, faqPage]);

    // Обработчик клика по вопросу и прокрутка
    const handleQuestionClick = (questionId) => {
        setActiveQuestion(prev => (prev === questionId ? null : questionId));

        // Прокрутка к вопросу
        setTimeout(() => {
            const ref = questionRefs.current[questionId];
            if (ref && ref.current) {
                ref.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100); // Небольшая задержка для анимации
    };

    // Обработчик клика по вопросу в нижнем списке
    const handleLowerQuestionClick = (captionIndex, subIndex, questionIndex) => {
        const questionId = `${captionIndex}-${subIndex}-${questionIndex}`;
        setActiveCaption(captionIndex); // Открываем нужный заголовок
        handleQuestionClick(questionId); // Открываем вопрос и выполняем прокрутку
    };

    return (
        <div className={styles.faqlist}>
            {faqPage.answer.map((item, captionIndex) => (
                <div key={captionIndex} className={styles.faqitem}>
                    <div
                        className={styles.faqcaptionquestion}
                        onClick={() => setActiveCaption(activeCaption === captionIndex ? null : captionIndex)}
                    >
                        {item.captionquestion}
                        <span className={styles.faqarrow}>{activeCaption === captionIndex ? '>' : '>'}</span>
                    </div>
                    {activeCaption === captionIndex && (
                        <div>
                            {item.subquestions.map((subitem, subindex) => (
                                <div key={subindex}>
                                    <div className={styles.faqcaption}>
                                        {subitem.caption}
                                    </div>
                                    {subitem.questions.map((question, qindex) => {
                                        const questionId = `${captionIndex}-${subindex}-${qindex}`; // Уникальный идентификатор

                                        // Инициализация рефа для каждого вопроса
                                        if (!questionRefs.current[questionId]) {
                                            questionRefs.current[questionId] = React.createRef();
                                        }

                                        return (
                                            <div key={qindex} ref={questionRefs.current[questionId]}>
                                                <div
                                                    className={styles.faqquestiontitle}
                                                    onClick={() => handleQuestionClick(questionId)}
                                                >
                                                    {question.title}
                                                    <span className={styles.faqarrow}>
                                                        {activeQuestion === questionId ? '−' : '+'}
                                                    </span>
                                                </div>
                                                {activeQuestion === questionId && (
                                                    <div className={styles.faqquestioncontent}>
                                                        {question.content}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
