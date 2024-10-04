import styles from "../css/FAQStyles.module.css";
import FAQSubQuestion from './FAQSubQuestion.jsx';
import { useRef, useEffect } from "react";
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
export default function FAQItem({ item }) {
    const [activeCaption, setActiveCaption] = useQueryState("activeCaption", { scroll: false, history: "replace", shallow: true });
    const itemRef = useRef(null); // Создаем ref

    useEffect(() => {
        if (activeCaption === item.queryFilter) {
            itemRef.current?.scrollIntoView({ behavior: 'smooth' }); // Прокрутка до элемента
        }
    }, [activeCaption]);
    return (
        <div ref={itemRef} key={item.queryFilter} className={styles.faqitem}>
            <div
                className={styles.faqcaptionquestion}
                onClick={() => { activeCaption !== item.queryFilter ? setActiveCaption(item.queryFilter) : setActiveCaption(null) }}
            >
                {item.captionquestion}
                <span className={styles.faqarrow}>{activeCaption === item.queryFilter ? '<' : '>'}</span>
            </div>
            {activeCaption === item.queryFilter && (
                <div>
                    {item.subquestions.map((subitem, subindex) => (
                        <FAQSubQuestion
                            key={subitem.id}
                            subitem={subitem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
