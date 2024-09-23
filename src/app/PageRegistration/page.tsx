import Image from "next/image";
import styles from "./page.module.css";
// import styles from "./styles/AuthenticationStyles.module.css";
import Layout from "../sharedComponents/Layout";
import RegistrationPage from "./RegistrationPage.jsx";
import registrationData from "./Registration.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <RegistrationPage registration={registrationData.RegistrationPage} />
      </div>
    </Layout>
  );
}
