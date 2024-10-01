import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import ConfirmationPage from "./ConfirmationPage";
import confirmationData from "./Confirmation.json";

export default function Home() {
  // Предполагаем, что email будет найден в данных JSON
  // Например, берем первый email для проверки
  const registeredEmail = confirmationData.ConfirmationPage.ConfirmationUser[0].email;

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <ConfirmationPage confirmation={confirmationData} email={registeredEmail} />
      </div>
    </Layout>
  );
}

