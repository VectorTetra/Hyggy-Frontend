import type { Metadata } from "next";
import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import Layout from "./sharedComponents/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HYGGY Все для дому",
  description: "Все для дому",
};

export default function RootLayout({
  children,
  pageMetadata,
}: Readonly<{
  children: React.ReactNode;
  pageMetadata?: Metadata;
}>) {
  const title = (pageMetadata?.title || metadata.title || "Default Title") as string;
  const description = (pageMetadata?.description || metadata.description || "Default Description") as string;

  return (
    <html lang="en">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <body className={inter.className}>
        <Layout headerType="header1" footerType="footer1">
          {children}
        </Layout>
      </body>

    </html>
  );
}
