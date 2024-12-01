import Image from "next/image";
import styles from "./page.module.css";
import 'react-quill/dist/quill.snow.css';
import Layout from "./sharedComponents/Layout";
import { MainPageBorder } from "./MainPageFiles/jsx/jsx-Border/MainPageBorder";
import MainPageBody from "./MainPageFiles/jsx/jsx-Body/MainPageBody";
import borderData from "./MainPageFiles/json/mainPageBorder.json";
import bodyData from "./MainPageFiles/json/mainPageBody.json";

export default function Home() {
  console.log("borderData", borderData);
  return (
    <Layout headerType="header1" footerType="footer1">
      {/* <div> */}
      <MainPageBorder />
      <MainPageBody bodyData={bodyData.bodyData} />
      <div></div>
      {/* </div> */}
    </Layout>
  );
}
