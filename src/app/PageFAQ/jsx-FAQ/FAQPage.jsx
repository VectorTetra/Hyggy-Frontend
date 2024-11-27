"use client";
import styles from "../css/FAQStyles.module.css";
import CommonQuestions from "./CommonQuestions";
import ContactSection from "./ContactSection";
import FAQSection from "./FAQSection";
import MainPageBodyAboutUs from "../../MainPageFiles/jsx/jsx-Body/MainPageBodyAboutUs";
import MainPageBodySubscriptionForm from "../../MainPageFiles/jsx/jsx-Body/MainPageBodySubscriptionForm";
import bodyData from "../../MainPageFiles/json/mainPageBody.json";
import { Suspense } from "react";

export default function FAQPage(props) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
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
                        </div>
                    </div>
                    <div className={styles.rightcontainer}>
                        <ContactSection faqPage={props.faqPage} />
                    </div>
                </div>
                <div>
                    <CommonQuestions faqPage={props.faqPage} />
                </div>
                <div className={styles.AboutUs}>
                    <MainPageBodyAboutUs aboutus={bodyData.bodyData.aboutus} />
                </div>
                <div>
                    <MainPageBodySubscriptionForm caption={bodyData.bodyData.formmail.caption}
                        forminfo={bodyData.bodyData.formmail.forminfo} />
                </div>
            </Suspense>
        </div>
    );
}
