"use client";
import React from "react";
import styles from "./css/ConfirmationStyles.module.css";

export default function ConfirmationPage(props) {
    const [code, setCode] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Шукаємо користувача по email
        const user = props.confirmation.ConfirmationUser.find(user => user.email === props.email);

        console.log('user', user)
        console.log('email', user.email)
        console.log('confirmationCode', user.confirmationCode)
        console.log('code', code)


        if (user && user.confirmationCode === code && typeof window !== "undefined") {
            alert('Обліковий запис успішно створено!');
            user.confirmationStatus = true;
            window.location.href = '../MainPage'; // Перехід поки що на головну, але згодом у особистий кабінет
        } else {
            setErrorMessage('');
            alert('Ви ввели невірний код');
        }
    };

    return (
        <div className={styles.maincontainer}>
            <div className={styles.formcontainer}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.caption}>Підтвердження облікового запису</div>

                    <input className={styles.formcontainerinput}
                        type="text"
                        name="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Введіть код"
                    />

                    {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                    <div>
                        <button type="submit" className={styles.submitbutton}>Підтвердити</button>
                    </div>
                    <button type="button" className={styles.submitbutton2} onClick={() => setCode('')}>Скасувати</button>
                </form>
            </div>
        </div>
    );
}
