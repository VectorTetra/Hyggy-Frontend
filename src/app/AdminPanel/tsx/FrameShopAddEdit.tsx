import PhotoUploader from '@/app/AdminPanel/tsx/PhotoUploader';
import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';
import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
import { useCreateShop, useShops, useUpdateShop } from '@/pages/api/ShopApi';
import { useStorages } from '@/pages/api/StorageApi';
import useAdminPanelStore from '@/store/adminPanel';
import { Autocomplete, Button, TextField, ThemeProvider, Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs, { Dayjs } from 'dayjs';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useEffect, useState } from 'react';
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

export default function FrameShopAddEdit() {
  const shopId = useAdminPanelStore((state) => state.shopId);
  const { mutate: createShop } = useCreateShop();
  const { mutate: updateShop } = useUpdateShop();
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const { data: storages = [] } = useStorages({
    SearchParameter: "GetGlobalStorages"
  });
  const { data: shopsIfEdit = [] } = useShops({
    SearchParameter: "Id",
    Id: Number(shopId)
  }, shopId !== null && shopId > 0);
  const [addressId, setAddressId] = useState<number>(0);
  const [storageId, setStorageId] = useState<number>(0);
  const [photos, setPhotos] = useState<string[]>([]);
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
  if (shopId === null) {
    setActiveTab('stores');
  }

  console.log("shopId", shopId);
  useEffect(() => {
    try {
      if (Array.isArray(shopsIfEdit) && shopsIfEdit.length > 0) {
        setName(shopsIfEdit[0].name);
        setPhotos([shopsIfEdit[0].photoUrl]);
        setAddressId(shopsIfEdit[0].addressId);
        setStorageId(shopsIfEdit[0].storageId);
        const getFullAddress = shopsIfEdit[0].street + " " + shopsIfEdit[0].houseNumber + " , " + shopsIfEdit[0].city;
        setCurrentAddress(getFullAddress);
        const convertedWorkHours = convertStringToWorkHours(shopsIfEdit[0].workHours);
        setWorkHours(convertedWorkHours);
      }
    } catch (error) {
      console.error('Error fetching storage data:', error);
    } finally {
      setLoading(false);
    }
  }, [shopsIfEdit])

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
    console.log("selectedStorage", selectedStorage);
    console.log("storageId", storageId);
    console.log("addressId", addressId);
    try {
      if (name.length === 0) {
        toast.error("Ім'я магазину не може бути пустим!");
        return;
      }
      if (photos.length === 0) {
        toast.error("Фото магазину обов'язкове!");
        return;
      }
      if (addressId === 0 || storageId === 0) {
        toast.error("Адреса магазину обов'язкова!");
        return;
      }
      if (shopId === 0) {
        //Додавання магазину
        await createShop({
          Name: name, PhotoUrl: photos[0], WorkHours: dataWorkHours, AddressId: addressId,
          StorageId: storageId
        });
        toast.success('Магазин успішно створено!');
      }
      else {
        //Зміна магазину
        await updateShop({
          Id: Number(shopId), Name: name, PhotoUrl: photos[0], WorkHours: dataWorkHours, AddressId: addressId,
          StorageId: storageId, OrderIds: shopsIfEdit[0].orderIds
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
    <ThemeProvider theme={themeFrame}>
      <Box className="flex flex-col gap-4">
        <Box className="flex flex-col gap-3">
          <TextField
            id="title"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Назва магазину"
            label='Назва магазину'
            className="w-full" />
          {currentAddress &&
            <label className="form-label" htmlFor="storage">Поточна адреса: {currentAddress}</label>
          }
          <Autocomplete
            options={storages}
            getOptionLabel={(option) => `${option.street} ${option.houseNumber}, ${option.city}`}
            value={selectedStorage}
            onChange={(e, newValue) => {
              if (newValue) {
                setStorageId(newValue.id);
                setAddressId(newValue.addressId);
                setSelectedStorage(newValue);
                console.log("selectedStorage", selectedStorage);
              }
            }}
            renderInput={(params) => <TextField {...params} label={shopId! > 0 ? "Нова адреса магазину" : "Адреса магазину"} />}
            fullWidth
          />
        </Box>
        <div>
          <label className="form-label" htmlFor="storage">Робочі години:</label>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                {workHours.map((day, index) => (
                  <DemoContainer components={['TimePicker']} key={index} sx={{ display: 'flex', flexDirection: "row !important", alignItems: "baseline", gap: "5px" }}>
                    <div style={{ display: "flex", flex: "0.1 1 1rem", justifyContent: "center", alignItems: "center" }}>
                      <label>{day.day}</label>
                    </div>
                    <div style={{ display: "flex", flex: 1 }}>
                      <TimeField
                        sx={{ display: "flex", flex: 1 }}
                        label="Початок"
                        value={dayjs(day.start, 'HH:mm')}
                        format="HH:mm"
                        onChange={(newTime: Dayjs) =>
                          updateTime(index, 'start', newTime)}
                      />
                    </div>
                    <div style={{ display: "flex", flex: 1 }}>
                      <TimeField
                        sx={{ display: "flex", flex: 1 }}
                        label="Кінець"
                        value={dayjs(day.end, 'HH:mm')}
                        format="HH:mm"
                        onChange={(newTime: Dayjs) =>
                          updateTime(index, 'end', newTime)}
                      />
                    </div>
                  </DemoContainer>
                ))}
              </div>
            </LocalizationProvider>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <PhotoUploader photos={photos} setPhotos={setPhotos} justifyPhotos='center'
            UploadPhoto={async (ev) => {
              const files = ev.target.files;
              if (files) {
                const data = await uploadPhotos(files);
                setPhotos(data);
              }
            }}
            removePhoto={async (filename) => {
              try {
                await getPhotoByUrlAndDelete(filename);
                setPhotos([]);
              }
              catch (error) {
                console.error('Error deleting photo:', error);
              }
              finally {
                setPhotos([]);
              }
            }}
            setIsPhotosDirty={null}
            maxPhotos={1}
            isStarPhotoAssigned={false}
          />
        </div>
        {shopId === 0 ? (
          <Button onClick={handleSubmit} variant='contained'>Додати магазин</Button>
        ) : (
          <Button onClick={handleSubmit} variant='contained'>Змінити магазин</Button>
        )}
      </Box>
    </ThemeProvider>
  )

}

