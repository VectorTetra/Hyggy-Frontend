"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "../sharedComponents/Layout";
import Link from "next/link";
import dynamic from "next/dynamic";
import useLocalStorageStore from "@/store/localStorage";
import { ShopGetDTO } from "@/pages/api/ShopApi";
//import MapComponent from "./tsx/MapComponent";  // імпортуємо новий компонент карти
const DynamicMap = dynamic(
    () => import('./tsx/MapComponent'),
    { ssr: false }
)
export default function Shop() {
    const [place, setPlace] = useState<ShopGetDTO | null>(null);
    const { shopToViewOnShopPage } = useLocalStorageStore();

    useEffect(() => {
        setPlace(shopToViewOnShopPage || null);
    }, [shopToViewOnShopPage]);

    const todayIndex = (new Date().getDay() + 6) % 7;

    return (
        <Layout footerType="footer4">
            <div className="md:mx-24 lg:mx-20 xs:mx-4">
                <div className="flex flex-col lg:flex-row mt-16 mb-20 gap-10">
                    <div className="flex flex-col lg:w-2/3 mt-6">
                        <h1 className="text-3xl font-semibold">{place?.name}</h1>
                        <h3 className="mt-2 text-[14px]">{place?.street}</h3>
                        <Link prefetch={true} href="#workhours" className="text-gray-500 text-[14px] mt-5 hover:underline lg:hidden">
                            Робочі години
                        </Link>
                        <Link
                            prefetch={true}
                            href="/shops"
                            className="cursor-pointer text-gray-500 text-[14px] mt-5 hover:underline"
                        >
                            Обрати інший магазин
                        </Link>
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
                        <ul className="mt-1 space-y-1">
                            {place?.workHours?.split("|").map((item, index) => (
                                <li key={index} className={index === todayIndex ? "bg-yellow-200" : ""}>
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
