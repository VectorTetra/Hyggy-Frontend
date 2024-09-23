import Layout from "../sharedComponents/Layout";
import PageProfileUser from "./tsx/PageProfileUser";
import profile from './PageProfileUser.json';

export default function Home() {

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <PageProfileUser dataUser={profile.profile} />
      </div>
    </Layout>
  );
}
