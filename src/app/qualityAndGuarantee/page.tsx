"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";

// Імпорт JSON-файлу
import jsonData from "./structure.json";

export default function QualityAndGuarantee() {
  const data = jsonData; // Використання даних із JSON-файлу

  const renderComponent = (component: any, index: number) => {
    switch (component.objectType) {
      case "image":
        return (
          <div className={styles.imageContainer} key={index}>
            <Image
              src="https://jysk.ua/sites/jysk.ua/files/image/blog/2021-12/header-basic_plus_gold.jpg"
              alt="Header"
              layout="fill"
              objectFit="cover" // Optional: Adjusts how the image should be resized to fit the container
            />
          </div>
        );
      case "h1":
        return (
          <h1 key={index} className={styles.h1}>
            {component.text}
          </h1>
        );
      case "h2":
        return (
          <h2 key={index} className={styles.h2}>
            {component.text}
          </h2>
        );
      case "h2 strong":
        return (
          <h2 key={index} className={styles.h2}>
            {component.text}
          </h2>
        );
      case "h3":
        return (
          <h3 key={index} className={styles.h3}>
            {component.text}
          </h3>
        );
      case "p":
        return (
          <p key={index} className={styles.p}>
            {component.text}
          </p>
        );
      case "ul":
        return (
          <ul key={index} className={styles.ul}>
            {component.items.map((item: any, i: any) => (
              <li key={i}>{item.text}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <Layout headerType="header1">
      <div className={styles.main}>
        {data.structure.map((component: any, index: any) =>
          renderComponent(component, index)
        )}
      </div>
    </Layout>
  );
}
