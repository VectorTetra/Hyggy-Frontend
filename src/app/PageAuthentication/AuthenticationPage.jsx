"use client";
import React from "react";
// import styles from "./page.module.css";
import styles from "./styles/AuthenticationStyles.module.css";
// import styles from '../../styles/MainPageHeader-styles.module.css';

export default function AuthenticationPage(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = props.AuthenticationPage.AuthenticationInfo.find(user => user.email === email);
        if (user && user.password === password) {
            setErrorMessage('');
            alert("Вхід здійснено успішно");
        } else {
            setErrorMessage('E-mail або пароль не вірні');
        }
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
                                <li>Зберігайте інформацію для майбутніх покупок</li>
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
