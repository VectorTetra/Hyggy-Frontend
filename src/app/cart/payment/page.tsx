"use client";
import { useState, useEffect } from "react";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const deliveryInfo = localStorage.getItem('deliveryInfo');
    console.log("Delivery Info:" + deliveryInfo)
    if (!deliveryInfo) {
      router.push('/cart/delivery');
    }
  }, [router]);

  const validateCardNumber = (value: string) => {
    return /^\d{16}$/.test(value);
  };

  const validateExpiryDate = (value: string) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return { isValid: false, message: "Формат MM/YY" };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    const [inputMonth, inputYear] = value.split("/").map(Number);

    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      return { isValid: false, message: "Термін дії карти завершився" };
    }

    return { isValid: true, message: "" };
  };


  const validateCVV = (value: string) => {
    return /^\d{3}$/.test(value);
  };

  const validateField = (name: string, value: string) => {
    let validationResult = { isValid: false, message: "" };

    if (name === "cardNumber") {
      validationResult = { isValid: validateCardNumber(value), message: "Номер картки має містити 16 цифр" };
    } else if (name === "expiryDate") {
      validationResult = validateExpiryDate(value);
    } else if (name === "cvv") {
      validationResult = { isValid: validateCVV(value), message: "CVV має містити 3 цифри" };
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validationResult.isValid,
    }));

    if (!validationResult.isValid) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [name]: validationResult.message,
      }));
    }
  };

  useEffect(() => {
    setIsFormValid(
      !errors.cardNumber && !errors.expiryDate && !errors.cvv &&
      formData.cardNumber !== "" && formData.expiryDate !== "" && formData.cvv !== ""
    );
  }, [errors, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleSubmit = () => {
    const cardNumberError = formData.cardNumber === "" || !validateCardNumber(formData.cardNumber);
    const expiryDateValidation = validateExpiryDate(formData.expiryDate);
    const expiryDateError = formData.expiryDate === "" || !expiryDateValidation.isValid;
    const cvvError = formData.cvv === "" || !validateCVV(formData.cvv);

    const newErrors = {
      cardNumber: cardNumberError,
      expiryDate: expiryDateError,
      cvv: cvvError,
    };

    setErrors(newErrors);

    if (!cardNumberError && !expiryDateError && !cvvError) {
      localStorage.setItem('paymentStatus', 'success');
      window.location.href = "/cart/success";
    }
  };


  const [errorMessages, setErrorMessages] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <center><h1>Оплата</h1></center>
      </div>
      <div className={styles.checkoutPage}>
        <div className={styles.formSection}>
          <form>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                placeholder="Номер карти*"
                className={`${styles.formInput} ${errors.cardNumber ? styles.errorInput : ''}`}
              />
              {errors.cardNumber && <p className={styles.error}>{errorMessages.cardNumber}</p>}
            </div>

            <div className={styles.formGroupRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY*"
                  className={`${styles.formInput} ${errors.expiryDate ? styles.errorInput : ''}`}
                />
                {errors.expiryDate && <p className={styles.error}>{errorMessages.expiryDate}</p>}
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  placeholder="CVV*"
                  className={`${styles.formInput} ${errors.cvv ? styles.errorInput : ''}`}
                />
                {errors.cvv && <p className={styles.error}>{errorMessages.cvv}</p>}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
              >
                Підтвердження
              </button>
            </div>
            <Link href="/cart/delivery">
              <button type="button" className={styles.cancelButton}>Скасувати</button>
            </Link>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
