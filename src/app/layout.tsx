import { Metadata } from "next";
import React from "react";
import { Raleway } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import QueryClientWrapper from "./sharedComponents/QueryClientWrapper";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HYGGY Все для дому",
  description: "Все для дому",
  icons: {
    icon: '/b_favikon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.className} body`} style={{ backgroundColor: "#f3f3f3" }}>
        <QueryClientWrapper>{children}</QueryClientWrapper>
        <ToastContainer
          stacked={true}
          autoClose={5000}
          position="bottom-right"
          pauseOnHover={false}
          theme="colored"
          transition={Bounce}
          closeOnClick={true}
          hideProgressBar={false}
          limit={3}
        />
      </body>
    </html>
  );
}