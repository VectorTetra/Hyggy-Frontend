import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import PasswordResetApp from "./jsx-passwordreset/PasswordResetApp";
import passwordResetData from "./PasswordReset.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <PasswordResetApp passwordResetData={passwordResetData.PasswordReset} />
      </div>
    </Layout>
  );
}
