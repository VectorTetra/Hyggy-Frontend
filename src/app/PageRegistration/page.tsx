import Layout from "../sharedComponents/Layout";
import RegistrationPage from "./RegistrationPage.jsx";
import registrationData from "./Registration.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <RegistrationPage registration={registrationData.RegistrationPage} />
    </Layout>
  );
}
