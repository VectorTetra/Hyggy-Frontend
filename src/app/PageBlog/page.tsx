import Layout from "../sharedComponents/Layout";
import BlogPage from "./jsx-blog/BlogPage";
import blogData from "./blog.json";

export const metadata = {
  title: "Натхнення HYGGY",
  description: "Натхнення HYGGY",
};

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer4">
      <div>
        <BlogPage blogPage={blogData.blogData} />
      </div>
    </Layout>
  );
}

