"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "../../sharedComponents/Layout";
import Link from "next/link";
import dynamic from "next/dynamic";
import useLocalStorageStore from "@/store/localStorage";
import { ShopGetDTO, useShops } from "@/pages/api/ShopApi";
import { useParams } from "next/navigation";
//import MapComponent from "./tsx/MapComponent";  // імпортуємо новий компонент карти
const DynamicMap = dynamic(
    () => import('../tsx/MapComponent'),
    { ssr: false }
)
export default function Shop() {
    const [place, setPlace] = useState<ShopGetDTO | null>(null);
    //const { shopToViewOnShopPage } = useLocalStorageStore();
    const params = useParams<{ id: string }>();
    const id = Number(params?.id);
    const { data: shopOneCol = [] } = useShops({
        SearchParameter: "Query",
        Id: id
    }, id !== null);


    useEffect(() => {
        if (shopOneCol.length > 0)
            setPlace(shopOneCol[0] || null);
    }, [shopOneCol]);

    const todayIndex = (new Date().getDay() + 6) % 7;
    if (!place) return null;
    return (
        <Layout footerType="footer4">
            <div className="md:mx-24 lg:mx-20 xs:mx-4">
                <div className="flex flex-col lg:flex-row mt-16 mb-20 gap-10">
                    <div className="flex flex-col lg:w-2/3 mt-6">
                        <h1 className="text-3xl font-semibold">{place?.name}</h1>
                        <h3 className="mt-2 text-[14px]">{place?.street},{place?.houseNumber} {place?.postalCode} {place?.city}</h3>
                        <Link prefetch={true}
                            href="#workhours"
                            className="
                            translate
                            text-gray-500
                            text-[14px]
                            mt-3
                            flex
                            gap-2 
                            no-underline
                            hover:underline 
                            lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>
                            Робочі години
                        </Link>
                        <Link prefetch={true}
                            href='/shops'
                            className="
                              translate
                              cursor-pointer 
                              text-gray-500 
                              text-[14px] 
                              mt-3 
                              flex 
                              gap-2
                              no-underline
                              hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Обрати інший магазин</Link>
                        {/* <Link prefetch={true} href="#workhours" className="text-gray-500 text-[14px] mt-5 hover:underline lg:hidden">
                            Робочі години
                        </Link>
                        <Link
                            prefetch={true}
                            href="/shops"
                            className="cursor-pointer text-gray-500 text-[14px] mt-5 hover:underline"
                        >
                            Обрати інший магазин
                        </Link> */}
                        {/* Використовуємо компонент карти */}
                        <DynamicMap place={place} />
                    </div>
                    <div className="p-3 mt-0 bg-gray-100 flex flex-col lg:w-1/3">
                        <Image
                            className="h-56"
                            src={place?.photoUrl || "/placeholder.jpg"}
                            alt={place?.name || "Зображення магазину"}
                            width={450}
                            height={500}
                        />
                        <h1 id="workhours" className="mt-10 text-2xl font-semibold">
                            Робочі години
                        </h1>
                        <ul className="mt-1 space-y-1 pl-0">
                            {place?.workHours?.split("|").map((item, index) => (
                                <li key={index} style={{
                                    backgroundColor: index === todayIndex ? "#00AAAD" : "",
                                    fontWeight: index === todayIndex ? "bold" : "normal",
                                    color: index === todayIndex ? "white" : "black"
                                }}>
                                    <span>{item.split(",")[0]}</span>: <span>{item.split(",")[1]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
