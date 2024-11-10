"use client";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
import Map from "./components/Map";
import List from "./components/List";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDebounce } from 'use-debounce';


const DeliveryPage = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("store");
  const [isPaymentButtonEnabled, setIsPaymentButtonEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);
  const [filteredStores, setFilteredStores] = useState<{ name: string; address: string; postalCode: string; city: string; latitude: number; longitude: number; }[]>([]);
  const [novaPoshtaWarehouses, setNovaPoshtaWarehouses] = useState([]);
  const [ukrPoshtaOffices, setUkrPoshtaOffices] = useState<{ name: string; address: string; postalCode: string; city: string; latitude: number; longitude: number; }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeliveryTypeChange = (e) => {
    const newDeliveryType = e.target.value;
    setSelectedDeliveryType(newDeliveryType);
    setSelectedStore(null);
    localStorage.setItem('selectedDeliveryType', newDeliveryType);
  };

  useEffect(() => {
    const savedDeliveryType = localStorage.getItem('selectedDeliveryType');
    if (savedDeliveryType) {
      setSelectedDeliveryType(savedDeliveryType);
    }

    const addressInfo = localStorage.getItem('addressInfo');
    if (!addressInfo) {
      router.push('/cart/address');
    } else {
      const parsedAddress = JSON.parse(addressInfo);
      if (selectedDeliveryType === "store") {
        setSearchQuery(``);
      }
      else if (selectedDeliveryType === "novaPoshta") {
        setSearchQuery(`${parsedAddress.city}, ${parsedAddress.street}`);
      }
      else if (selectedDeliveryType === "ukrPoshta") {
        setSearchQuery(`${parsedAddress.city}, ${parsedAddress.street}, ${parsedAddress.houseNumber}`);
      }
    }
  }, [selectedDeliveryType, router]);


  useEffect(() => {
    if (selectedDeliveryType === "store") {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else if (selectedDeliveryType === "novaPoshta") {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else if (selectedDeliveryType === "ukrPoshta") {
      setIsPaymentButtonEnabled(selectedStore !== null);
    } else {
      setIsPaymentButtonEnabled(true);
    }
  }, [selectedDeliveryType, selectedStore]);

  useEffect(() => {
    const deliveryInfo = {
      selectedDeliveryType,
      selectedStore,
      deliveryCost: selectedDeliveryType === "courier" ? 110
        : selectedDeliveryType === "novaPoshta" ? 75
          : selectedDeliveryType === "ukrPoshta" ? 50
            : 0,
      deliveryDays: selectedDeliveryType === "courier" || selectedDeliveryType === "novaPoshta" || selectedDeliveryType === "ukrPoshta" ? 12 : 18
    };
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
  }, [selectedDeliveryType, selectedStore]);



  useEffect(() => {
    const stores = [
      { name: "Hyggy Odessa", address: "вул. Харківська 1/2", postalCode: "40024", city: "Odessa", latitude: 46.482526, longitude: 30.7233095 },
      { name: "Hyggy Odessa2", address: "вул. Харківська 2/2", postalCode: "40024", city: "Odessa", latitude: 46.482526, longitude: 30.8233095 },
      { name: "Hyggy Mykolaiv", address: "вул. Харківська 3/2", postalCode: "40024", city: "Mykolaiv", latitude: 46.96591, longitude: 31.9974 },
      { name: "Hyggy Kharkiv", address: "вул. Харківська 4/2", postalCode: "40024", city: "Kharkiv", latitude: 49.988358, longitude: 36.232845 },
    ];

    if (searchQuery) {
      const filtered = stores.filter(store =>
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.postalCode.includes(searchQuery)
      );
      setFilteredStores(filtered);
    } else {
      setFilteredStores(stores);
    }
  }, [searchQuery]);

  const getNovaPoshtaWarehouses = async (searchQuery) => {
    setLoading(true);
    const parts = searchQuery.split(",");
    const cityName = parts[0]?.trim();
    const findByString = parts[1]?.trim();
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
          FindByString: findByString,
          CityName: cityName
        },
      }),
    });

    const data = await response.json();
    setLoading(false);
    return data.data;
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (selectedDeliveryType === "novaPoshta" && debouncedSearchQuery !== "") {
        const warehouses = await getNovaPoshtaWarehouses(debouncedSearchQuery);
        setNovaPoshtaWarehouses(warehouses.map(warehouse => ({
          name: warehouse.Description,
          address: warehouse.ShortAddress,
          city: warehouse.CityDescription,
          postalCode: warehouse.PostalCodeUA,
          latitude: parseFloat(warehouse.Latitude),
          longitude: parseFloat(warehouse.Longitude),
        })));
      }
    };

    fetchWarehouses();
  }, [selectedDeliveryType, debouncedSearchQuery]);

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

  const getUkrPoshtaOfficesByAddress = async (searchQuery) => {
    setLoading(true);
    setUkrPoshtaOffices([]);

    const coordinates = await getCoordinates(searchQuery);

    if (!coordinates) {
      setLoading(false);
      return;
    }

    const response = await axios.get('/api/region', {
      params: { lat: coordinates.latitude, long: coordinates.longitude, maxDistance: 5 }
    });

    const offices = response.data.Entries.Entry.map(entry => ({
      name: entry.POSTFILIALNAME,
      address: entry.ADDRESS,
      postalCode: entry.POSTINDEX,
      city: entry.CITYNAME,
      latitude: parseFloat(entry.LATITUDE),
      longitude: parseFloat(entry.LONGITUDE),
    }));

    setUkrPoshtaOffices(offices);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDeliveryType === "ukrPoshta" && debouncedSearchQuery !== "") {
      getUkrPoshtaOfficesByAddress(debouncedSearchQuery);
    }
  }, [selectedDeliveryType, debouncedSearchQuery]);

  const handleButtonSearch = async () => {
    if (selectedDeliveryType === "novaPoshta") {
      const warehouses = await getNovaPoshtaWarehouses(searchQuery);
      setNovaPoshtaWarehouses(warehouses.map(warehouse => ({
        name: warehouse.Description,
        address: warehouse.ShortAddress,
        city: warehouse.CityDescription,
        postalCode: warehouse.PostalCodeUA,
        latitude: parseFloat(warehouse.Latitude),
        longitude: parseFloat(warehouse.Longitude),
      })));
    }
    if (selectedDeliveryType === "ukrPoshta") {
      await getUkrPoshtaOfficesByAddress(searchQuery);
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


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
          <div>
            <label>
              <input
                type="radio"
                name="delivery"
                value="store"
                checked={selectedDeliveryType === "store"}
                onChange={handleDeliveryTypeChange}
                className="mr-2"
              />
              <b>Забрати в магазині HYGGY</b> (0,00 грн Доставка 12-18 робочих днів)
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="delivery"
                value="courier"
                checked={selectedDeliveryType === "courier"}
                onChange={handleDeliveryTypeChange}
                className="mr-2"
              />
              <b>Доставка на адресу кур’єром Нової пошти</b> (110,00 грн Доставка 10-12 робочих днів)
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="delivery"
                value="novaPoshta"
                checked={selectedDeliveryType === "novaPoshta"}
                onChange={handleDeliveryTypeChange}
                className="mr-2"
              />
              <b>Доставка до відділення Нової пошти</b> (75,00 грн Доставка 10-12 робочих днів)
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="delivery"
                value="ukrPoshta"
                checked={selectedDeliveryType === "ukrPoshta"}
                onChange={handleDeliveryTypeChange}
                className="mr-2"
              />
              <b>Доставка до відділення Укрпошти</b> (50,00 грн Доставка протягом 10-12 робочих днів)
            </label>
          </div>
        </div>

        {selectedDeliveryType === "store" && (
          <div className="mt-6">
            <i>Введіть поштовий індекс або назву вулиці, щоб знайти найближчі магазини HYGGY.</i>
          </div>
        )}

        {selectedDeliveryType === "courier" && (
          <div className="mt-6">
            <i>Доставку замовлення здійснює Перевізник. Доставка 10-12 робочих днів.</i>
          </div>
        )}

        {selectedDeliveryType === "novaPoshta" && (
          <div className="mt-6">
            <i>Введіть повну назву вулиці, щоб знайти відділення Нової пошти.</i>
          </div>
        )}

        {selectedDeliveryType === "ukrPoshta" && (
          <div className="mt-6">
            <i>Введіть повну назву вулиці, щоб знайти відділення Укрпошти.</i>
          </div>
        )}

        {(selectedDeliveryType === "store" || selectedDeliveryType === "") && (
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
                <h3 className="text-2xl mb-4">Виберіть магазин</h3>
                <List
                  setSelectedStore={setSelectedStore}
                  selectedStore={selectedStore}
                  stores={filteredStores}
                />
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={filteredStores} />
              </div>
            </div>
          </>
        )}

        {selectedDeliveryType === "novaPoshta" && (
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
                  />)}
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={novaPoshtaWarehouses} />
              </div>
            </div>
          </>
        )}

        {selectedDeliveryType === "ukrPoshta" && (
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
                  />
                )}
              </div>
              <div className="bg-gray-500 shrink-0 lg:w-[613px] h-[548px]">
                <Map setSelectedStore={setSelectedStore} selectedStore={selectedStore} stores={ukrPoshtaOffices} />
              </div>
            </div>
          </>
        )}

        <Link href={isPaymentButtonEnabled ? "/cart/payment" : "#"}>
          <center>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isPaymentButtonEnabled}
            >
              Виберіть тип оплати
            </button>
          </center>
        </Link>

        <Link href="/cart/address">
          <button type="button" className={styles.cancelButton}>Скасувати</button>
        </Link>
      </div>
    </Layout>
  );
};

export default DeliveryPage;