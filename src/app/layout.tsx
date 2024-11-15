import type { Metadata } from "next";
import React from 'react';
import { Raleway } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import QueryClientWrapper from "./sharedComponents/QueryClientWrapper";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const raleway = Raleway({ subsets: ["latin"] });

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
      <body className={raleway.className} style={{ backgroundColor: "#f3f3f3" }}>
        <QueryClientWrapper>
          {children}
        </QueryClientWrapper>
        <ToastContainer
          stacked={true}
          autoClose={5000}
          position='bottom-right'
          pauseOnHover={false}
          theme='colored'
          transition={Bounce}
          closeOnClick={true}
          hideProgressBar={false}
          limit={3}
        />
      </body>
    </html>
  );
}
