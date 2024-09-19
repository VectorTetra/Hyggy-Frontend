"use client";
import React from "react";
import styles from "./css/RegistrationStyles.module.css";

export default function RegistrationPage(props) {
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [checkboxStates, setCheckboxStates] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState('');

    // Функция для проверки пароля
    const isPasswordValid = (password) => {
        // Минимум 8 символов, хотя бы одна заглавная буква и хотя бы одна цифра
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const generateConfirmationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Генерация 6-значного кода
    };

    // Очищаем форму, если нажата кнопка "Скасувати"
    const handleReset = () => {
        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCheckboxStates({});
        setErrorMessage('');
    };

    // Проверки
    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверка, что все поля заполнены
        if (!name || !surname || !email || !password || !confirmPassword) {
            setErrorMessage('');
            alert('Всі поля обов\'язкові для заповнення');
            return;
        }

        // Проверка паролей
        if (password !== confirmPassword) {
            setErrorMessage('');
            alert('Паролі не збігаються');
            return;
        }

        if (!isPasswordValid(password)) {
            setErrorMessage('');
            alert('Пароль повинен містити мінімум 8 символів, включати хоча б одну заглавну букву і одну цифру.');
            return;
        }

        // Проверка всех чекбоксов
        const allChecked = props.registration.label.every(item => checkboxStates[item.name]);
        if (!allChecked) {
            setErrorMessage('');
            alert('Необхідно прийняти умови та підписатися на новини');
            return;
        }

        // Проверка, существует ли уже такой пользователь
        const existingUser = props.registration.RegistrationUser.find(user =>
            user.email === email
        );

        if (existingUser) {
            setErrorMessage('');
            alert('Користувач з таким e-mail вже існує');
            return;
        }

        const confirmationCode = generateConfirmationCode();

        // Регистрация прошла успешно
        setErrorMessage('');
        alert('Ваш обліковий запис створено. Ми відправили підтвердження на вашу пошту. Будь ласка, активуйте свій обліковий запис, натиснувши на кнопку у листі. Якщо ви не отримали листа, будь ласка, перевірте теку зі спамом або спробуйте увійти у свій обліковий запис ще раз, для того щоб ми надіслали вам повторний лист для активації.');

        window.location.href = './PageConfirmation';

    };

    // Обработчик изменения состояния чекбоксов
    const handleCheckboxChange = (name) => {
        setCheckboxStates(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    return (
        <div className={styles.maincontainer}>
            <div className={styles.formcontainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.caption}>Створити обліковий запис</div>
                    <div>
                        <input className={styles.formInput}
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ім'я *"
                        />
                    </div>
                    <div>
                        <input className={styles.formInput}
                            type="text"
                            name="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Прізвище *"
                        />
                    </div>
                    <div>
                        <input className={styles.formInput}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="^[A-Za-z.-_]{3,}@[A-Za-z]+\.[A-Za-z]+$"
                            placeholder="E-mail *"
                        />
                    </div>
                    <div>
                        <input className={styles.formInput}
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль *"
                        />
                    </div>
                    <div>
                        <input className={styles.formInput}
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторити пароль *"
                        />
                    </div>
                    <div className={styles.checkboxesTableContainer}>
                        <table className={styles.checkboxesTable}>
                            <tbody>
                                {props.registration.label.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input className={styles.formCheckbox}
                                                type="checkbox"
                                                checked={checkboxStates[item.name] || false}
                                                onChange={() => handleCheckboxChange(item.name)}
                                            />
                                        </td>
                                        <td>
                                            <label style={{ "margin": "0", "padding": "0" }}> {item.name} </label>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>

                            {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                        </table >

                    </div>

                    <div>
                        <button type="submit" className={styles.submitbutton}>Створити обліковий запис</button>
                    </div>

                    <button type="button" className={styles.submitbutton2} onClick={handleReset}>Скасувати</button>
                </form >
            </div >
        </div >
    );
}
