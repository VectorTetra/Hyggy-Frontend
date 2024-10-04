import { useRef, useEffect } from "react";
import styles from "../css/FAQStyles.module.css";
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
export default function FAQQuestion({ question }) {
    const [activeQuestion, setActiveQuestion] = useQueryState("activeQuestion", { scroll: false, history: "replace", shallow: true });
    const questionRef = useRef(null);
    useEffect(() => {
        if (activeQuestion === question.id) {
            questionRef.current?.scrollIntoView({ behavior: 'smooth' }); // Прокрутка до элемента
        }
    }, [activeQuestion]);
    return (
        <div key={question.id} ref={questionRef}>
            <div className={styles.faqquestiontitle} onClick={() => {
                activeQuestion !== question.id ? setActiveQuestion(question.id) : setActiveQuestion(null)
            }}>
                {question.title}
                <span className={styles.faqarrow}>
                    {activeQuestion === question.id ? '−' : '+'}
                </span>
            </div>
            {activeQuestion === question.id && (
                <div className={styles.faqquestioncontent}>
                    {question.content}
                </div>
            )}
        </div>
    );
};
