import Layout from "../sharedComponents/Layout";
import BlogPage from "./jsx-blog/BlogPage";
import blogData from "./blog.json";

export default function Home() {

  const pageMetadata = {
    title: "Натхнення HYGGY",
    description: "Натхнення HYGGY",
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <BlogPage blogPage={blogData.blogData} />
      </div>
    </Layout>
  );
}

