"use client";
import forgotPassword from "@/pages/api/resetpassword";
import React from "react";
import styles from '../css/passwordResetStyle.module.css';
import { Button } from "@mui/material";


export default  function EmailInput({ passwordResetData, onSwitchComponent }) {
    console.log("EmailInput props:", { passwordResetData, onSwitchComponent });
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const user = passwordResetData.Users.find(user => user.email === email);

        // if (user) {
        //     // Генерація ссилки скидання паролю
        //     const resetLink = `${window.location.href}?reset=${user.userId}`;
        //     user.resetLink = resetLink;

        //     setMessage('');
        //     alert("Посилання для скидання паролю відправлено на ваш e-mail.");
        // } else {
        //     setMessage('');
        //     alert("Користувача з таким e-mail не знайдено");
        // }
        const response = await forgotPassword(email);
        if(response){
            alert("Ми надіслали листа на вказану вами електронну адресу. Будь ласка, перевірте папку Спам або спробуйте ще раз, якщо ви не отримали листа протягом 15 хвилин.")
            setEmail("");
        }else{
            console.log("Щось пішло не так")
        }
    };

    return (
        <div className={styles.formcontainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.caption}>Забули пароль?</div>

                <input className={styles.formInput}
                    type="email"
                    placeholder="Введіть e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                    <button type="submit" className={styles.submitbutton}>Надіслати</button>
                </div>
                <button type="button" className={styles.submitbutton2} onClick={() => setEmail('')}>Скасувати</button>
            </form>
        </div>
    );
}
