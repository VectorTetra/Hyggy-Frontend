"use client";
import React from "react";
import styles from "../css/FAQStyles.module.css";

export default function FAQSection({ faqPage, activeTitleIndex }) {
    const [activeCaption, setActiveCaption] = React.useState(null);
    const [activeQuestion, setActiveQuestion] = React.useState(null);

    React.useEffect(() => {
        if (activeTitleIndex !== null) {
            let currentIndex = 0;

            for (let i = 0; i < faqPage.answer.length; i++) {
                for (let j = 0; j < faqPage.answer[i].subquestions.length; j++) {
                    for (let k = 0; k < faqPage.answer[i].subquestions[j].questions.length; k++) {
                        if (currentIndex === activeTitleIndex) {
                            setActiveCaption(i);  // Устанавливаем активный caption
                            setActiveQuestion(k); // Устанавливаем активный question
                            return;
                        }
                        currentIndex++;
                    }
                }
            }
        }
    }, [activeTitleIndex, faqPage]);

    return (
        <div className={styles.faqlist}>
            {faqPage.answer.map((item, index) => (
                <div key={index} className={styles.faqitem}>
                    <div
                        className={styles.faqcaptionquestion}
                        onClick={() => setActiveCaption(activeCaption === index ? null : index)}
                    >
                        {item.captionquestion}
                        <span className={styles.faqarrow}>{activeCaption === index ? '>' : '>'}</span>
                    </div>
                    {activeCaption === index && (
                        <div>
                            {item.subquestions.map((subitem, subindex) => (
                                <div key={subindex}>
                                    <div className={styles.faqcaption}>
                                        {subitem.caption}
                                    </div>
                                    {subitem.questions.map((question, qindex) => (
                                        <div key={qindex}>
                                            <div
                                                className={styles.faqquestiontitle}
                                                onClick={() => setActiveQuestion(activeQuestion === qindex ? null : qindex)}
                                            >
                                                {question.title}
                                                <span className={styles.faqarrow}>
                                                    {activeQuestion === qindex ? '−' : '+'}
                                                </span>
                                            </div>
                                            {activeQuestion === qindex && (
                                                <div className={styles.faqquestioncontent}>
                                                    {question.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
