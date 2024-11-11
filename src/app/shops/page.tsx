"use client";
import { useState } from "react";
import Layout from "../sharedComponents/Layout";
import Map from "./components/Map";
import Link from "next/link";


export default function Shops() {

  const pageMetadata = {
    title: "Магазини HYGGY",
    description: "Магазини HYGGY",
  };


  return (
    <Layout headerType='header1' pageMetadata={pageMetadata}>
      <div className="mx-8 md:mx-24 lg:mx-24">
        <div className="flex gap-4 mt-10 ">
          <Link className="text-[12px] text-gray-400" href="#">Домашня сторінка</Link>
          <Link className="text-[12px] text-gray-400" href="#">Магазини</Link>
        </div>
        <div className="mt-10 flex justify-center">
          <h1 className="text-3xl">Знайти найближчий магазин</h1>
        </div>
        <div className="flex flex-wrap mt-10 gap-4 lg:flex-nowrap">
          <input className="
            bg-[#E0E0E0] mb-3 text-2xl text-[#00000080] 
            w-[770px] h-10 border border-[#00000080] rounded-md 
             shadow focus:shadow-[#00AAAD] focus:outline-none focus:border-none
            md:w-full"></input>
          <button className="bg-[#00AAAD] text-white text-[18px] whitespace-nowrap font-bold px-8 h-10 border rounded-md w-full lg:w-auto">Шукати магазини</button>
          <button className="font-light whitespace-nowrap bg-[#E0E0E0] h-10 px-8 lg:ml-auto ">Зараз відчинено</button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
          <div className="bg-gray-500 shrink-0 lg:w-2/3 h-[500px]">
            <Map />
          </div>
          <div className="flex flex-col lg:w-1/3 text-center shadow-md h-fit py-4 px-8">
            <h3 className="text-2xl">Виберіть магазин</h3>
            <p className="mt-2 text-gray-500">
              Щоб вибрати магазин, натисніть відповідний значок на карті. Після вибору значка магазина масштаб карти збільшується на цій ділянці.
            </p>
          </div>
        </div>
      </div>
    </Layout>

  )
}
