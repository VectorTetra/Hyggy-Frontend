"use client";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
//import Map from "./tsx/Map";
import dynamic from 'next/dynamic';
import List from "./tsx/List";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { getShops, ShopDTO } from '@/pages/api/ShopApi';
import useLocalStorageStore from "@/store/localStorage";
import { useOrderDeliveryTypes } from "@/pages/api/OrderDeliveryTypeApi";

const Map = dynamic(
  () => import('./tsx/Map'),
  { ssr: false }
)
const DeliveryPage = () => {
  const [selectedStore, setSelectedStore] = useState<ShopDTO | null>(null);
  const [isPaymentButtonEnabled, setIsPaymentButtonEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);
  const [novaPoshtaWarehouses, setNovaPoshtaWarehouses] = useState([]);
  const [ukrPoshtaOffices, setUkrPoshtaOffices] = useState<ShopDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<ShopDTO[]>([]);
  const [filteredStores, setFilteredStores] = useState<ShopDTO[]>([]);
  const router = useRouter();
  const { getCartFromLocalStorage, selectedDeliveryType, setSelectedDeliveryType, setDeliveryInfo, addressInfo } = useLocalStorageStore();
  const { data: orderDeliveryTypes = [], isSuccess: isDeliveryTypesSuccessfullyLoaded } = useOrderDeliveryTypes({
    SearchParameter: "Query",
    PageNumber: 1,
    PageSize: 100,
  }, true);

  const handleDeliveryTypeChange = (e) => {
    const newDeliveryType = e.target.value;
    setSelectedDeliveryType(orderDeliveryTypes.find(deliveryType => deliveryType.id === parseInt(newDeliveryType)));
    setSelectedStore(null);
  };

  useEffect(() => {
    const savedCartItems = getCartFromLocalStorage();
    if (savedCartItems.length === 0) {
      router.push('/');
    }
    if (!addressInfo) {
      router.push('/cart/address');
    } else {
      setSearchQuery(`${addressInfo.City}, ${addressInfo.Street}`);
    }


  }, [router, addressInfo]);

  useEffect(() => {
    // Якщо тип доставки не обраний, встановлюємо "Самовивіз" за замовчуванням
    if (!selectedDeliveryType && orderDeliveryTypes.length > 0) {
      setSelectedDeliveryType(orderDeliveryTypes.find(deliveryType => deliveryType.id === 1));
    }
  }, [selectedDeliveryType, orderDeliveryTypes]);

  useEffect(() => {
    if (selectedDeliveryType?.id === 1) {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else if (selectedDeliveryType?.id === 3) {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else if (selectedDeliveryType?.id === 4) {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else {
      setIsPaymentButtonEnabled(true);
    }
  }, [selectedDeliveryType, selectedStore]);

  useEffect(() => {
    const deliveryInfo = {
      selectedDeliveryType,
      selectedStore,
    };
    setDeliveryInfo(deliveryInfo);
  }, [selectedDeliveryType, selectedStore]);

  const getCoordinates = async (address) => {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });
    const [location] = response.data;
    return location ? { latitude: parseFloat(location.lat).toFixed(4), longitude: parseFloat(location.lon).toFixed(4) } : null;
  };

  // Функция для вычисления расстояния между двумя точками (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Расстояние в километрах
  };

  // Получаем ближайшие отделения Новой Почты
  const getNearestNovaPoshtaWarehouses = async (searchQuery) => {
    setLoading(true);
    const coordinates = await getCoordinates(searchQuery);
    if (!coordinates) {
      setLoading(false);
      return;
    }

    const cityName = searchQuery.split(",")[0]?.trim();
    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: "93f4038537ed7f8133f22dc8694e24ff",
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityName: cityName,
        },
      }),
    });

    const data = await response.json();

    // Фильтруем отделения, где название начинается с "Відділення"
    const filteredWarehouses = data.data.filter(warehouse =>
      warehouse.Description.startsWith("Відділення")
    ).map(warehouse => ({
      name: warehouse.Description,
      address: warehouse.ShortAddress,
      city: warehouse.CityDescription,
      postalCode: warehouse.PostalCodeUA,
      latitude: parseFloat(warehouse.Latitude),
      longitude: parseFloat(warehouse.Longitude),
    }));

    // Сортируем отделения по расстоянию
    const sortedWarehouses = filteredWarehouses.map(warehouse => ({
      ...warehouse,
      distance: calculateDistance(coordinates.latitude, coordinates.longitude, warehouse.latitude, warehouse.longitude),
    })).sort((a, b) => a.distance - b.distance);

    // Берем только 5 ближайших
    setNovaPoshtaWarehouses(sortedWarehouses.slice(0, 5));
    setLoading(false);
  };

  // useEffect(() => {
  //   if (selectedDeliveryType?.id === 3 && debouncedSearchQuery !== "") {
  //     getNearestNovaPoshtaWarehouses(debouncedSearchQuery);
  //   }
  // }, [selectedDeliveryType, debouncedSearchQuery]);

  const getNearestShops = async (searchQuery) => {
    try {
      setLoading(true);
      const coordinates = await getCoordinates(searchQuery);
      if (!coordinates) {
        setLoading(false);
        return;
      }
      const data = await getShops({
        SearchParameter: "NearestShops",
        Latitude: parseFloat(coordinates.latitude),
        Longitude: parseFloat(coordinates.longitude),
      });
      setStores(data);
      setFilteredStores(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  // useEffect(() => {
  //   if (selectedDeliveryType?.id === 1 && debouncedSearchQuery !== "") {
  //     getNearestShops(debouncedSearchQuery)
  //   }
  // }, [selectedDeliveryType, debouncedSearchQuery]);

  const getUkrPoshtaOfficesByAddress = async (searchQuery) => {
    setLoading(true);
    setUkrPoshtaOffices([]);

    const coordinates = await getCoordinates(searchQuery);

    if (!coordinates) {
      setLoading(false);
      return;
    }

    const response = await axios.get('/api/region', {
      params: { lat: coordinates.latitude, long: coordinates.longitude, maxDistance: 100 }
    });

    const offices = response.data.Entries.Entry.map(entry => ({
      name: entry.POSTFILIALNAME,
      address: entry.ADDRESS,
      postalCode: entry.POSTINDEX,
      city: entry.CITYNAME,
      latitude: parseFloat(entry.LATITUDE),
      longitude: parseFloat(entry.LONGITUDE),
    }));

    setUkrPoshtaOffices(offices.slice(0, 5));
    setLoading(false);
  };

  // useEffect(() => {
  //   if (selectedDeliveryType?.id === 4 && debouncedSearchQuery !== "") {
  //     getUkrPoshtaOfficesByAddress(debouncedSearchQuery);
  //   }
  // }, [selectedDeliveryType, debouncedSearchQuery]);

  const handleButtonSearch = async () => {
    if (selectedDeliveryType?.id === 3) {
      await getNearestNovaPoshtaWarehouses(searchQuery);
    }
    if (selectedDeliveryType?.id === 4) {
      await getUkrPoshtaOfficesByAddress(searchQuery);
    }
    if (selectedDeliveryType?.id === 1) {
      await getNearestShops(searchQuery);
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (selectedDeliveryType?.id === 1 && filteredStores.length > 0 && !selectedStore) {
      setSelectedStore(filteredStores[0]);
    } else if (selectedDeliveryType?.id === 3 && novaPoshtaWarehouses.length > 0 && !selectedStore) {
      setSelectedStore(novaPoshtaWarehouses[0]);
    } else if (selectedDeliveryType?.id === 4 && ukrPoshtaOffices.length > 0 && !selectedStore) {
      setSelectedStore(ukrPoshtaOffices[0]);
    }
  }, [selectedDeliveryType, filteredStores, novaPoshtaWarehouses, ukrPoshtaOffices, selectedStore]);

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <center>
          <h1>Оплата</h1>
        </center>
      </div>

      <div className="mx-8 md:mx-24 lg:mx-24">
        <h2><b>Виберіть тип доставки</b></h2>
        <div className="mt-6">

          {isDeliveryTypesSuccessfullyLoaded &&
            orderDeliveryTypes.map((deliveryType) => (
              <div key={deliveryType.id}>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    value={deliveryType.id}
                    checked={selectedDeliveryType?.id === deliveryType.id}
                    onChange={handleDeliveryTypeChange}
                    className="mr-2"
                  />
                  <b>{deliveryType.name}</b> ({deliveryType.price} грн; Доставка {deliveryType.minDeliveryTimeInDays} -  {deliveryType.maxDeliveryTimeInDays} робочих днів)
                </label>
              </div>
            ))
          }
        </div>

        {selectedDeliveryType?.id === 1 && (
          <div className="mt-6">
            <i>Введіть місто і назву вулиці, щоб знайти найближчі магазини HYGGY.</i>
          </div>
        )}

        {selectedDeliveryType?.id === 2 && (
          <div className="mt-6">
            <i>Доставку замовлення здійснює Перевізник. Доставка {selectedDeliveryType.minDeliveryTimeInDays} -  {selectedDeliveryType.maxDeliveryTimeInDays} робочих днів</i>
          </div>
        )}

        {selectedDeliveryType?.id === 3 && (
          <div className="mt-6">
            <i>Введіть місто і назву вулиці, щоб знайти відділення Нової пошти.</i>
          </div>
        )}

        {selectedDeliveryType?.id === 4 && (
          <div className="mt-6">
            <i>Введіть місто і назву вулиці, щоб знайти відділення УкрПошти.</i>
          </div>
        )}

        {(selectedDeliveryType?.id === 1 || selectedDeliveryType === null) && (
          <>
            <div className="flex flex-wrap mt-10 gap-4 lg:flex-nowrap">
              <input
                className="
                bg-[#E0E0E0] 
                mb-3
                text-2xl 
                text-[#00000080] 
                w-full 
                h-10 
                border 
                border-[#00000080] 
                rounded-md 
                shadow 
                focus:shadow-[#00AAAD] 
                focus:outline-none 
                focus:border-none 
                md:w-[1300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button onClick={handleButtonSearch}
                className="
                bg-[#00AAAD] 
                text-white 
                text-[18px] 
                whitespace-nowrap 
                font-bold 
                px-8 
                h-10 
                border 
                rounded-md 
                w-full 
                lg:w-auto 
                hover:bg-[#016264]
                transition-colors">
                Пошук
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl mb-4">Виберіть магазин</h3>
                {loading ? (
                  <p>Завантаження магазинів...</p>
                ) : (<List
                  setSelectedStore={setSelectedStore}
                  selectedStore={selectedStore}
                  stores={filteredStores}
                  selectedDeliveryType={selectedDeliveryType}
                />)}
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={filteredStores} />
              </div>
            </div>
          </>
        )}

        {selectedDeliveryType?.id === 3 && (
          <>
            <div className="flex flex-wrap mt-10 gap-4 lg:flex-nowrap">
              <input
                className="bg-[#E0E0E0] mb-3 text-2xl text-[#00000080] w-full h-10 border border-[#00000080] rounded-md shadow focus:shadow-[#00AAAD] focus:outline-none focus:border-none md:w-[1300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button onClick={handleButtonSearch} className="bg-[#00AAAD] text-white text-[18px] whitespace-nowrap font-bold px-8 h-10 border rounded-md w-full lg:w-auto">
                Пошук
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl mb-4">Виберіть відділення Нової Пошти</h3>
                {loading ? (
                  <p>Завантаження відділень...</p>
                ) : (
                  <List
                    setSelectedStore={setSelectedStore}
                    selectedStore={selectedStore}
                    stores={novaPoshtaWarehouses}
                    selectedDeliveryType={selectedDeliveryType}
                  />)}
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={novaPoshtaWarehouses} />
              </div>
            </div>
          </>
        )}

        {selectedDeliveryType?.id === 4 && (
          <>
            <div className="flex flex-wrap mt-10 gap-4 lg:flex-nowrap">
              <input
                className="bg-[#E0E0E0] mb-3 text-2xl text-[#00000080] w-full h-10 border border-[#00000080] rounded-md shadow focus:shadow-[#00AAAD] focus:outline-none focus:border-none md:w-[1300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button onClick={handleButtonSearch} className="bg-[#00AAAD] text-white text-[18px] whitespace-nowrap font-bold px-8 h-10 border rounded-md w-full lg:w-auto">
                Пошук
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl mb-4">Виберіть відділення Укрпошти</h3>
                {loading ? (
                  <p>Завантаження відділень...</p>
                ) : (
                  <List
                    setSelectedStore={setSelectedStore}
                    selectedStore={selectedStore}
                    stores={ukrPoshtaOffices}
                    selectedDeliveryType={selectedDeliveryType}
                  />
                )}
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={ukrPoshtaOffices} />
              </div>
            </div>
          </>
        )}
        <center>
          <Link prefetch={true} href={isPaymentButtonEnabled ? "/cart/payment" : "#"}>
          
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isPaymentButtonEnabled}
            >
              Виберіть тип оплати
            </button>
          </Link>
          <p>
            <button type="button" className={styles.cancelButton} onClick={() => router.back()}>Скасувати</button>
          </p>
        </center>
      </div>
    </Layout>
  );
};

export default DeliveryPage;