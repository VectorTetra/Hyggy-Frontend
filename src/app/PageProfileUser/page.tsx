import Layout from "../sharedComponents/Layout";
import PageProfileUser from "./tsx/PageProfileUser";

export default function Home() {

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <PageProfileUser />
      </div>
    </Layout>
  );
}
