import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import BlogPage from "./jsx-blog/BlogPage";
import blogData from "./blog.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <BlogPage blogPage={blogData.blogData} />
      </div>
    </Layout>
  );
}

