// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "../css/FAQStyles.module.css";
// import CommonQuestions from "./CommonQuestions";
// import ContactSection from "./ContactSection";
// import FAQSection from "./FAQSection";


// export default function FAQPage(props) {
//     const router = useRouter();
//     const [activeTitleIndex, setActiveTitleIndex] = useState(null);

//     // Логика для обработки открытия соответствующего блока
//     useEffect(() => {
//         const query = router.query; // Получаем query
//         if (query && query.section) { // Проверяем, что query существует и содержит section
//             const { section } = query; // Получаем параметр section из URL
//             if (section) {
//                 // В зависимости от значения параметра раскрываем соответствующий вопрос
//                 if (section === "delivery") {
//                     setActiveTitleIndex(2);
//                 } else if (section === "return") {
//                     setActiveTitleIndex(3);
//                 }
//             }

//         }
//     }, [router.query]); // Срабатывает при изменении параметров роутера

//     const handleTitleClick = (index) => {
//         console.log("Clicked index: ", index); // Отладочная информация
//         setActiveTitleIndex(index);
//     };

//     return (
//         <div className={styles.pagecontainer}>
//             <div className={styles.leftcontainer}>
//                 <div className={styles.faqcontainer}>
//                     <h2>{props.faqPage.caption.textcaption}</h2>
//                     {props.faqPage.paragraph.map(item => (
//                         <div key={item.textparagraph} className={styles.faqcontainertext}>{item.textparagraph}</div>
//                     ))}

//                     <div>
//                         <FAQSection faqPage={props.faqPage} activeTitleIndex={activeTitleIndex} />
//                     </div>
//                     <div>
//                         <CommonQuestions faqPage={props.faqPage} onTitleClick={handleTitleClick} />
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.rightcontainer}>
//                 <ContactSection faqPage={props.faqPage} />
//             </div>
//         </div>
//     );
// }

"use client";
import styles from "../css/FAQStyles.module.css";
import CommonQuestions from "./CommonQuestions";
import ContactSection from "./ContactSection";
import FAQSection from "./FAQSection";

export default function FAQPage(props) {
    return (
        <div className={styles.pagecontainer}>
            <div className={styles.leftcontainer}>
                <div className={styles.faqcontainer}>
                    <h2>{props.faqPage.caption.textcaption}</h2>
                    {props.faqPage.paragraph.map(item => (
                        <div key={item.textparagraph} className={styles.faqcontainertext}>{item.textparagraph}</div>
                    ))}

                    <div>
                        <FAQSection faqPage={props.faqPage} />
                    </div>
                    <div>
                        <CommonQuestions faqPage={props.faqPage} />
                    </div>
                </div>
            </div>
            <div className={styles.rightcontainer}>
                <ContactSection faqPage={props.faqPage} />
            </div>
        </div>
    );
}
