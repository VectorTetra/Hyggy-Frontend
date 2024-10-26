import React, { useEffect, useState } from 'react'
import { getStorages } from '@/pages/api/StorageApi';
import { postShop } from '@/pages/api/ShopApi';
import Uploader from './Uploader'
import Image from 'next/image'
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Box } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { map } from 'lodash';
import { uploadPhotos } from '@/pages/api/ImageApi';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { toast } from 'react-toastify';
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

export default function NewShop() {
  const [storages, setStorages] = useState<Storage[]>([])
  const [addressId, setAddressId] = useState<number>(0);
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
  const [name, setName] = useState("");
  const [storageId, setStorageId] = useState<number>(0);
  const [dataWorkHours, setDataWorkHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
  const [activeNewShop, setActiveNewShop] = useQueryState("new-edit", { clearOnDefault: true, scroll: false, history: "push", shallow: true });
  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const data = await getStorages({
          SearchParameter: "Query",
          IsGlobal: true
        });
        setStorages(data);

      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStorages();
  }, []);

  useEffect(() => {
    if (storages.length > 0) {
      setAddressId(storages[0].addressId)
      setStorageId(storages[0].id)
    }
    console.log(addressId, storageId);
  }, [storages])

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
  }, workHours)
  function handleSubmit() {
    try {
      if (name.length === 0) {
        toast.error("Ім'я магазину не може бути пустим!");
        return;
      }
      if (photo.length === 0) {
        toast.error("Фото магазину обов'язкове!");
        return;
      }
      const response = postShop({
        Name: name, PhotoUrl: photo, WorkHours: dataWorkHours, AddressId: addressId,
        StorageId: storageId
      });
      console.log(response);
      //window.location.reload();  // Повне перезавантаження сторінки
      setActiveTab('stores');
      setActiveNewShop(null);
      toast.success('Магазин успішно створено!');
    } catch (error) {
      console.error(error.text);
      toast.error(error.response);
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
  async function UploadPhoto(ev) {
    const files = ev.target.files;
    if (files) {
      const formData = new FormData();
      // Append each file individually to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);  // 'photos' should match the key in the backend
      }
      const data = await uploadPhotos(files);
      console.log(data);
      setPhoto(data[0]);
      // onChange(prev => {
      //   return [...prev, ...data];
      // });
    }
  }


  return (
    <form action={handleSubmit} className="flex flex-col max-w-sm mx-auto  gap-4">
      <div>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="title">Назва магазину:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Назва магазину"
          className="w-full border p-2 rounded" />
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="storage">Адреса магазина:</label>
        <select
          name="storage"
          id="storage"
          className="w-full border p-2 rounded"
          value={storageId}
          onChange={e => handleSelectChange(e)}
        >
          <option value="" disabled>
            Виберіть адресу
          </option>
          {storages && storages.map((storage) => (
            <option key={storage.id} value={storage.id}>{storage.street + storage.houseNumber + ' , ' + storage.city}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-600 font-bold uppercase block mt-6 mb-1" htmlFor="storage">Робочі години:</label>
        <div className='flex gap-2 items-center justify-center'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {workHours.map((day, index) => (
                <DemoContainer components={['TimePicker']}>
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
        <button type="button" className="border border-[#00AAAD] text-[#00AAAD] hover:bg-[#00AAAD] hover:text-white rounded-xl h-12">Додати фото магазину</button>
        {/* <Image className="h-56" src="/images/Shops/OdessaHyggy.png" alt="Магазин,Суми" width={450}
            height={500}></Image> */}
        <input type="file" accept='image' onChange={UploadPhoto}></input>
      </div>
      <button className="bg-[#00AAAD] text-white text-xl font-bold rounded-xl shadow-xl py-4">Додати магазин</button>
    </form>
  )

}

