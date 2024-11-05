
import Image from "next/image";
import styles from "./page.module.css";
// import styles from "./styles/AuthenticationStyles.module.css";
import Layout from "../sharedComponents/Layout";
import AuthenticationPage from "./AuthenticationPage.jsx";
// import authenticationData from "./AuthenticationInfo.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">

      <AuthenticationPage />

    </Layout>
  );
}
