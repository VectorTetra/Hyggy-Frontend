"use client";
import forgotPassword from "@/pages/api/resetpassword";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from 'react-toastify';
import styles from '../css/passwordResetStyle.module.css';

export default function EmailInput({ passwordResetData, onSwitchComponent }) {
    console.log("EmailInput props:", { passwordResetData, onSwitchComponent });
    const [email, setEmail] = React.useState('');

    const navigate = useRouter();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await forgotPassword(email);
        if (response) {
            toast.success("Ми надіслали листа на вказану вами електронну адресу. Будь ласка, перевірте папку Спам або спробуйте ще раз, якщо ви не отримали листа протягом 15 хвилин.")
            setEmail("");
        } else {
            console.log("Щось пішло не так")
        }
    };


    return (
        <div className={styles.formcontainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.caption}>Забули пароль?</div>

                <TextField className={styles.formInput}
                    sx={{ fontFamily: "inherit" }}
                    type="email"
                    label="Введіть Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                    <button type="submit" className={styles.submitbutton}>Надіслати</button>
                </div>
                <button type="button" className={styles.submitbutton2} onClick={() => router.back()}>Скасувати</button>
            </form>
        </div>
    );
}
