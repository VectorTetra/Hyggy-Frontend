"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddressDTO } from "@/pages/api/AddressApi";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
import useLocalStorageStore, { CartItem } from "@/store/localStorage";
import Link from 'next/link';
import InputMask from 'react-input-mask';
import { formatCurrency } from "@/app/sharedComponents/methods/formatCurrency";
import { Checkbox } from "@mui/material";

const AddressPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    city: false,
    street: false,
    houseNumber: false,
    email: false,
    phone: false,
    cityNotFound: false,
    streetNotFound: false,
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);

  const {
    formData,
    setFormData,
    getCartFromLocalStorage,
    setAddressInfo,
  } = useLocalStorageStore();

  useEffect(() => {
    const savedCartItems = getCartFromLocalStorage();
    setCartItems(savedCartItems);
    if (savedCartItems.length === 0) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const isValid = formData !== null && Object.values(formData).every(value => value !== "") && formData.termsAccepted;
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    if (formData !== null) {
      setFormData({
        ...formData,
        [name]: updatedValue,
      });
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value === "",
      cityNotFound: name === "city" && citySuggestions.length === 0,
      streetNotFound: name === "street" && streetSuggestions.length === 0,
    }));

    if (name === "city") {
      fetchCitySuggestions(value);
    } else if (name === "street") {
      fetchStreetSuggestions(value);
    }
  };

  const fetchCitySuggestions = async (query: string) => {
    if (query.length > 2) {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${query}&country=Ukraine&format=json&accept-language=uk&limit=1`);
      const data = await response.json();
      const cityNames = data.map((item: any) => item.display_name.split(',')[0]);
      setCitySuggestions(cityNames);

      if (data == "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cityNotFound: true,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cityNotFound: false,
        }));
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const fetchStreetSuggestions = async (query: string) => {
    if (query.length > 2 && formData?.city) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?street=${query}&city=${formData.city}&country=Ukraine&format=json&accept-language=uk`
      );
      const data = await response.json();
      let streetNames = data.map((item: any) => item.display_name.split(',')[0].replace(/вулиця|Вулиця/i, "").trim());

      streetNames = streetNames.filter((value, index, self) => self.indexOf(value) === index);

      setStreetSuggestions(streetNames);

      if (data == "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          streetNotFound: true,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          streetNotFound: false,
        }));
      }
    } else {
      setStreetSuggestions([]);
    }
  };

  const handleCitySelect = (city: string) => {
    if (formData !== null) {
      setFormData({
        ...formData,
        city,
      });
    }
    setCitySuggestions([]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      cityNotFound: false,
    }));
  };

  const handleStreetSelect = (street: string) => {
    if (formData !== null) {
      setFormData({
        ...formData,
        street,
      });
    }
    setStreetSuggestions([]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      streetNotFound: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: formData?.firstName === "",
      lastName: formData?.lastName === "",
      city: formData?.city === "",
      street: formData?.street === "",
      houseNumber: formData?.houseNumber === "",
      email: formData?.email === "" || formData?.email === undefined || !validateEmail(formData?.email),
      phone: formData?.phone === "",
      cityNotFound: errors.cityNotFound,
      streetNotFound: errors.streetNotFound,
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const addressInfo: AddressDTO = {
        City: formData?.city || "",
        Street: formData?.street || "",
        HouseNumber: formData?.houseNumber || "",
      };
      setAddressInfo(addressInfo);
      window.location.href = "/cart/delivery";
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.finalPrice * item.quantity;
    }, 0);
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <center><h1>Оплата</h1></center>
      </div>
      <div className={styles.checkoutPage}>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            <h2>Адреса</h2>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleInputChange}
                placeholder="Ім'я*"
                className={`${styles.formInput} ${errors.firstName ? styles.errorInput : ''}`}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleInputChange}
                placeholder="Прізвище*"
                className={`${styles.formInput} ${errors.lastName ? styles.errorInput : ''}`}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="city"
                value={formData?.city || ""}
                onChange={handleInputChange}
                placeholder="Місто*"
                className={`${styles.formInput} ${errors.city || errors.cityNotFound ? styles.errorInput : ''}`}
              />
              {citySuggestions.length > 0 && (
                <ul className={styles.suggestionsList}>
                  {citySuggestions.map((city, index) => (
                    <li key={index} onClick={() => handleCitySelect(city)}>
                      {city}
                    </li>
                  ))}
                </ul>
              )}
              {errors.cityNotFound && <p className={styles.errorMessage}>Місто не знайдено</p>}
            </div>
            <div className={styles.formGroupRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="street"
                  value={formData?.street || ""}
                  onChange={handleInputChange}
                  placeholder="Вулиця*"
                  className={`${styles.formInput} ${errors.street || errors.streetNotFound ? styles.errorInput : ''}`}
                />
                {streetSuggestions.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {streetSuggestions.map((street, index) => (
                      <li key={index} onClick={() => handleStreetSelect(street)}>
                        {street}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.streetNotFound && <p className={styles.errorMessage}>Вулиця не знайдена</p>}
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData?.houseNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Номер будинку*"
                  className={`${styles.formInput} ${errors.houseNumber ? styles.errorInput : ''}`}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                placeholder="E-mail*"
                className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
              />
            </div>
            <div className={styles.formGroup}>
              <InputMask
                mask="+38 (099) 999-99-99"
                value={formData?.phone || ""}
                onChange={handleInputChange}
              >
                {() => (
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Мобільний телефон*"
                    className={`${styles.formInput} ${errors.phone ? styles.errorInput : ''}`}
                  />
                )}
              </InputMask>
            </div>
            <div className={styles.formGroup}>
              <label>
              <Checkbox
                  sx={{
                    padding: '0px',
                    color: '#00AAAD',
                    '&.Mui-checked': {
                      color: '#00AAAD',
                    },
                  }}
                  size="small"
                  name="termsAccepted"
                  checked={formData?.termsAccepted || false}
                  onChange={handleInputChange}
                  required
                /> Прийняти <Link prefetch={true} href="https://jysk.ua/umovi-ta-polozhennya#8" className={styles.termsLink}>Умови та положення</Link>
              </label>
            </div>
            <center>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                  Перейти до доставки
                </button>
              </div>
              <p>
                <button type="button" className={styles.cancelButton} onClick={() => router.back()}>Скасувати</button>
              </p>
            </center>
          </form>
        </div>

        <div className={styles.cartSummary}>
          {cartItems.length > 0 && (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemImageContainer}>
                    <img
                      src={item.product.previewImagePath}
                      alt={item.product.description}
                      className={styles.cartItemImage}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <p>{item.product.description}</p>
                    <div className={styles.info}>
                      <p>{item.product.name}</p>
                      <p>Кількість: {item.quantity} шт</p>
                    </div>
                  </div>
                  <div className={styles.price}>
                    <p>{formatCurrency(item.product.finalPrice, "грн / шт")}</p>
                    <p>{formatCurrency(item.product.finalPrice * item.quantity, "грн")}</p>
                  </div>
                </div>
              ))}
              <p className={styles.totalPrice}>Всього: {formatCurrency(calculateTotalPrice(), "грн")}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;
