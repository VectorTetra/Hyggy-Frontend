import Layout from "../sharedComponents/Layout";
import PageAllCategory from "./jsx/PageAllCategory";
import bodyData from './AllCategory.json';

export default function Home() {

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <PageAllCategory bodyData={bodyData.bodyData} />
      </div>
    </Layout>
  );
}
