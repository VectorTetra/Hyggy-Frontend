"use client";

import { useSearchParams } from 'next/navigation';
import Layout from "../sharedComponents/Layout";
import PageBlogCategory from "./BlogCategory/PageBlogCategory";
import categories from './data.json';

export default function Home() {
  const searchParams = useSearchParams();
  const caption = searchParams ? searchParams.get('caption') || 'вітальня' : 'вітальня';

  const categoryKey = caption.toLowerCase();

  return (
    <Layout headerType="header1" footerType="footer4">
      <div>
        <PageBlogCategory caption={categoryKey} />
      </div>
    </Layout>
  );
}
