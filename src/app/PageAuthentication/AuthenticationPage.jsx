"use client";
import React from "react";
import styles from "./styles/AuthenticationStyles.module.css";
import { useRouter } from "next/navigation";
import useAuthorizeStore from "@/store/authorize";
import { toast } from "react-toastify";
import { Authorize, getDecodedToken } from "@/pages/api/TokenApi";


export default function AuthenticationPage(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const router = useRouter();


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Неправильний E-mail або пароль!")
        }
        Authorize({ Email: email, Password: password }).then((response) => {
            if (response.isAuthSuccessfull) {
                router.push("../PageProfileUser");
                toast.success('Ви успішно увійшли в особистий кабінет!');
                const decodedToken = getDecodedToken();
                if (decodedToken) {
                    toast.info(`Токен діє до: ${new Date(decodedToken.exp * 1000).toLocaleString()}`);
                }
            }
        });


    };


    return (
        <div className={styles.maincontainer}>
            <div className={styles["category-caption"]}>
                <div className={styles.formcontainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.caption}>Вхід</div>

                        <input className={styles.formcontainerinput}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="^[A-Za-z.-_]{3,}@[A-Za-z]+\.[A-Za-z]+$"
                            placeholder="E-mail"
                        />


                        <input className={styles.formcontainerinput}
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="пароль"
                        />

                        {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}

                        <button type="submit" className={styles.submitbutton}>Увійти</button>

                    </form>

                    <div className={styles.forgotpasswordlink}>
                        <a href="../PagePasswordReset">Забули пароль?</a>
                    </div>
                    <div>
                        <h2 className={styles.h2}>Створити новий обліковий запис</h2>
                        <div className={styles.features}>
                            <ul className={styles.featuresul}>
                                <li className={styles.featuresil}>Відстежуйте ваші посилки від замовлення до доставки</li>
                                <li className={styles.featuresil}>Зберігайте історію замовлень</li>
                                <li className={styles.featuresil}>Додавайте товари до списку бажань</li>
                                <li className={styles.featuresil}>Зберігайте інформацію для майбутніх покупок</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <button
                            className={styles.submitbutton2}
                            onClick={() => window.location.href = '../PageRegistration'}>
                            Створити новий обліковий запис
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
