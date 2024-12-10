import React, { useEffect, useState } from 'react'
import { getStorages } from '@/pages/api/StorageApi';
import { postShop, putShop, getShops } from '@/pages/api/ShopApi';
import { uploadPhotos, getPhotoByUrlAndDelete } from '@/pages/api/ImageApi';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Box } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import useAdminPanelStore from '@/store/adminPanel';

type Storage = {
  addressId: number;
  city: string;
  houseNumber: string;
  id: number;
  latitude: number;
  longitude: number;
  postalCode: string
  shopId: number | null
  shopName: string | null
  state: string
  storedWaresSum: number
  street: string
}

export default function FrameShopAddEdit() {
  // const searchParams = new URLSearchParams(window.location.search);

  // const [id, setId] = useState<string | null>(searchParams.get('new-edit'));
  const searchParams = useSearchParams();
  const shopId = useAdminPanelStore((state) => state.shopId);
  const [storages, setStorages] = useState<Storage[]>([])
  const [addressId, setAddressId] = useState<number>(0);
  const [storageId, setStorageId] = useState<number>(0);
  const [photo, setPhoto] = useState("");
  const [workHours, setWorkHours] = useState([
    {
      day: "Пн:",
      start: "10:00",
      end: "22:00"
    },
    {
      day: "Вт:",
      start: "10:00",
      end: "22:00"
    }, {
      day: "Ср:",
      start: "10:00",
      end: "22:00"
    }, {
      day: "Чт:",
      start: "10:00",
      end: "22:00"
    }, {
      day: "Пт:",
      start: "10:00",
      end: "22:00"
    }, {
      day: "Сб:",
      start: "10:00",
      end: "22:00"
    }, {
      day: "Нд:",
      start: "10:00",
      end: "22:00"
    }
  ]);
  const [currentAddress, setCurrentAddress] = useState("");
  const [name, setName] = useState("");
  const [dataWorkHours, setDataWorkHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "stores", scroll: false, history: "push", shallow: true });
  //const [activeNewShop, setActiveNewShop] = useQueryState("new-edit", { scroll: false, history: "push", shallow: true });

  useEffect(() => {
    if (shopId === null) {
      //setSelectedPosition(null);
      setActiveTab('stores');
    }
  }, []);

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const data = await getStorages({
          SearchParameter: "GetGlobalStorages"
        });
        setStorages(data);

      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStorages();
    console.log(shopId);
    if (shopId === null) {
      return;
    }
  }, []);

  useEffect(() => {
    console.log(shopId);

    if (shopId === null) {
      return;
    }
    const fetchShops = async () => {
      try {
        const data = await getShops({
          SearchParameter: "Id",
          Id: Number(shopId)
        });
        if (Array.isArray(data) && data.length > 0) {
          setName(data[0].name);
          setPhoto(data[0].photoUrl);
          setAddressId(data[0].addressId);
          setStorageId(data[0].storageId);
          const getFullAddress = data[0].street + " " + data[0].houseNumber + " , " + data[0].city;
          setCurrentAddress(getFullAddress);
          const convertedWorkHours = convertStringToWorkHours(data[0].workHours);
          setWorkHours(convertedWorkHours);
        }

      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [shopId])

  useEffect(() => {
    if (storages.length > 0) {
      setAddressId(storages[0].addressId)
      setStorageId(storages[0].id)
    }
  }, [storages.length])

  useEffect(() => {
    setDataWorkHours(
      "Понеділок," + workHours[0].start + " - " + workHours[0].end + "|" +
      "Вівторок," + workHours[1].start + " - " + workHours[1].end + "|" +
      "Середа," + workHours[2].start + " - " + workHours[2].end + "|" +
      "Четвер," + workHours[3].start + " - " + workHours[3].end + "|" +
      "П'ятниця," + workHours[4].start + " - " + workHours[4].end + "|" +
      "Субота," + workHours[5].start + " - " + workHours[5].end + "|" +
      "Неділя," + workHours[6].start + " - " + workHours[6].end)
    console.log(dataWorkHours);
  }, [workHours])

  const convertStringToWorkHours = (str) => {

    const daysMapping = ["Пн:", "Вт:", "Ср:", "Чт:", "Пт:", "Сб:", "Нд:"];

    return str.split('|').map((dayString, index) => {
      // Розбиваємо на частини: день і часи
      const [day, hours] = dayString.split(',');
      const [start, end] = hours.trim().split(' - ');  // Розбиваємо часи на start та end

      // Створюємо об'єкт із днем та часами
      return {
        day: daysMapping[index] || day,  // Використовуємо мапінг для скорочень
        start,
        end
      };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (name.length === 0) {
        toast.error("Ім'я магазину не може бути пустим!");
        return;
      }
      if (photo.length === 0) {
        toast.error("Фото магазину обов'язкове!");
        return;
      }
      if (addressId === 0 || storageId === 0) {
        toast.error("Адреса магазину обов'язкова!");
        return;
      }
      if (shopId === null) {
        //Додавання магазину
        const response = await postShop({
          Name: name, PhotoUrl: photo, WorkHours: dataWorkHours, AddressId: addressId,
          StorageId: storageId
        });
        toast.success('Магазин успішно створено!');
      }
      else {
        //Зміна магазину
        const response = await putShop({
          Id: Number(shopId), Name: name, PhotoUrl: photo, WorkHours: dataWorkHours, AddressId: addressId,
          StorageId: storageId
        });
        toast.success('Магазин успішно змінено!');
      }



    } catch (error) {
      console.error(error.text);
      toast.error(error.response);
    } finally {
      setActiveTab('stores');
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);  // Отримуємо вибране значення (id)
    const selectedStorage = storages.find(storage => storage.id === selectedId);  // Шукаємо об'єкт у масиві

    if (selectedStorage) {
      setAddressId(selectedStorage.addressId);  // Встановлюємо addressId
      setStorageId(selectedStorage.id);  // Встановлюємо storageId
    }

  };

  async function UploadPhoto(ev) {
    const files = ev.target.files;
    if (files) {
      const formData = new FormData();
      // Append each file individually to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);  // 'photos' should match the key in the backend
      }
      const data = await uploadPhotos(files);
      setPhoto(data[0]);
      // onChange(prev => {
      //   return [...prev, ...data];
      // });
    }
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    setPhoto("");
    getPhotoByUrlAndDelete(filename);
  }

  const updateTime = (index: number, type: 'start' | 'end', newTime: Dayjs) => {
    if (newTime) {
      const newValue = newTime.format('HH:mm');// Конвертуємо Dayjs в строку "HH:mm"
      setWorkHours((prev) =>
        prev.map((day, i) =>
          i === index ? { ...day, [type]: newValue } : day
        )
      );
    }


  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-sm mx-auto  gap-4">
      <div>
        <label className="form-label" htmlFor="title">Назва магазину:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Назва магазину"
          className="w-full border p-2 rounded" />
        <label className="form-label" htmlFor="storage">Адреса магазина:</label>
        {currentAddress &&
          <label className="form-label" htmlFor="storage">Поточна адреса: {currentAddress}</label>
        }
        <select
          name="storage"
          id="storage"
          className="w-full border p-2 rounded"
          value={storageId}
          onChange={e => handleSelectChange(e)}
        >
          {storages && storages.map((storage) => (
            <option key={storage.id} value={storage.id}>{storage.street + ' ' + storage.houseNumber + ' , ' + storage.city}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="storage">Робочі години:</label>
        <div className='flex gap-2 items-center justify-center'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {workHours.map((day, index) => (
                <DemoContainer components={['TimePicker']} key={index}>
                  <label>{day.day}</label>
                  <TimeField
                    label="Початок"
                    value={dayjs(day.start, 'HH:mm')}
                    format="HH:mm"
                    onChange={(newTime: Dayjs) =>
                      updateTime(index, 'start', newTime)}
                  />
                  <TimeField
                    label="Кінець"
                    value={dayjs(day.end, 'HH:mm')}
                    format="HH:mm"
                    onChange={(newTime: Dayjs) =>
                      updateTime(index, 'end', newTime)}
                  />
                </DemoContainer>
              ))}
            </Box>
          </LocalizationProvider>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {!photo &&
          <label className="cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl text-xl text-gray-600">
            <input type="file" className="hidden" onChange={UploadPhoto} multiple />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            Завантажити фото
          </label>
        }
        {photo &&
          <div className="h-64 flex relative">
            <img className="rounded-2xl w-full object-cover" src={photo} />
            <button onClick={(ev) => removePhoto(ev, photo)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        }
      </div>
      {shopId === null ? (
        <button className="bg-[#00AAAD] text-white text-xl font-bold rounded-xl shadow-xl py-4 w-full">Додати магазин</button>
      ) : (
        <button className="bg-[#00AAAD] text-white text-xl font-bold rounded-xl shadow-xl py-4 w-full">Змінити магазин</button>
      )}
    </form>
  )

}

