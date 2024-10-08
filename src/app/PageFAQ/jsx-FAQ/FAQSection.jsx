"use client";
import styles from "../css/FAQStyles.module.css";
import FAQItem from './FAQItem.jsx';
export default function FAQSection({ faqPage }) {

    return (
        <div className={styles.faqlist}>
            {faqPage.answer.map((item) => (
                <FAQItem
                    key={item.queryFilter}
                    item={item}
                />
            ))}
        </div>
    );
}
