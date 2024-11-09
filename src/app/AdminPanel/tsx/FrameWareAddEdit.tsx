import { Box, Button, TextField, Typography, CircularProgress, FormControlLabel, Checkbox, Select, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { useCreateWare, useUpdateWare, getWares, postJsonConstructorFile, putJsonConstructorFile, getJsonConstructorFile } from '@/pages/api/WareApi';
import { toast } from 'react-toastify';
import { useQueryState } from 'nuqs';
import { getWareCategories3, useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import InvoiceForm from './InvoiceForm';
import { useSearchParams } from 'next/navigation';
import useInvoiceStore from '@/store/invoiceStore';
import { uploadPhotos, getPhotoByUrlAndDelete } from '@/pages/api/ImageApi';
import { set } from 'lodash';
import { deleteWareImage, postWareImage } from '@/pages/api/WareImageApi';
import PhotoUploader from './PhotoUploader';

export default function WareAddEditFrame() {
    const { data: categories = [], isLoading: categoriesLoading, isSuccess: categoriesSuccess } = useWareCategories3({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc"
    });
    const { rows, addRow, removeRow, updateRow, clearRows, setRows, wareDetails, setWareDetails } = useInvoiceStore();
    const { mutateAsync: createWare } = useCreateWare();
    const { mutateAsync: updateWare } = useUpdateWare();
    const searchParams = useSearchParams();
    const wareId = parseInt(searchParams?.get("new-edit") || "0");

    const [article, setArticle] = useState<number>(0);
    const [wareCategory3, setWareCategory3] = useState<WareCategory3 | null>(null);
    const [wareCategory3Id, setWareCategory3Id] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [structureFilePath, setStructureFilePath] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [isDeliveryAvailable, setIsDeliveryAvailable] = useState<boolean>(false);
    const [isPhotosDirty, setIsPhotosDirty] = useState<boolean>(false);
    const [reviewIds, setReviewIds] = useState<number[]>([]);
    const [statusIds, setStatusIds] = useState<number[]>([]);
    const [priceHistoryIds, setPriceHistoryIds] = useState<number[]>([]);
    const [wareItemIds, setWareItemIds] = useState<number[]>([]);
    const [orderItemIds, setOrderItemIds] = useState<number[]>([]);
    const [trademarkId, setTrademarkId] = useState<number | null>(null);
    const [customerFavoriteIds, setCustomerFavoriteIds] = useState<string[]>([]);
    const [imageIds, setImageIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });

    useEffect(() => {
        if (wareId === null) {
            //setSelectedPosition(null);
            setActiveTab('products');
        }
    }, []);

    useEffect(() => {
        const fetchWareData = async (id: number) => {
            setLoading(true);
            try {
                const wares = await getWares({ SearchParameter: 'Query', Id: id });
                if (wares && wares.length > 0) {
                    const ware = wares[0];
                    setArticle(ware.article);
                    setName(ware.name);
                    setDescription(ware.description);
                    setPrice(ware.price);
                    setDiscount(ware.discount);
                    setIsDeliveryAvailable(ware.isDeliveryAvailable || false);
                    setWareCategory3Id(ware.wareCategory3Id);
                    setReviewIds(ware.reviewIds);
                    setStatusIds(ware.statusIds);
                    setPriceHistoryIds(ware.priceHistoryIds);
                    setWareItemIds(ware.wareItemIds);
                    setOrderItemIds(ware.orderItemIds);
                    setTrademarkId(ware.trademarkId);
                    setCustomerFavoriteIds(ware.customerFavoriteIds);
                    setImageIds(ware.imageIds);
                    setPhotos(ware.imagePaths);
                    console.log("ware.structureFilePath", ware.structureFilePath)

                    if (ware.structureFilePath && ware.structureFilePath.length > 0) {
                        setStructureFilePath(ware.structureFilePath);
                        const response = await getJsonConstructorFile(ware.structureFilePath);
                        console.log("jsonConstrFileResponse", response);

                        // Обробка детальної інформації
                        const detailsItem = response.find((item: any) => item.type === "details");
                        setWareDetails(detailsItem && detailsItem.value ? detailsItem.value : "");

                        // Обробка властивостей товару
                        const propertiesItem = response.find((item: any) => item.type === "properties");
                        setRows(propertiesItem && propertiesItem.value ? propertiesItem.value : []);
                    }
                }

            } catch (error) {
                console.error('Error fetching ware data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (wareId && wareId !== 0) {
            fetchWareData(wareId);
        }
    }, [wareId]);

    useEffect(() => {
        const fetchCategory = async (catId: number) => {
            const wareCategory3toSet = await getWareCategories3({
                SearchParameter: "Id",
                Id: catId
            });
            setWareCategory3(wareCategory3toSet[0]);

        }
        if (wareCategory3Id) {
            fetchCategory(wareCategory3Id);
        }
    }, [wareCategory3Id])

    async function UploadPhoto(ev) {
        setIsPhotosDirty(true);
        const files = ev.target.files;
        if (files) {
            const formData = new FormData();
            // Append each file individually to FormData
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i]);  // 'photos' should match the key in the backend
            }
            const data = await uploadPhotos(files);
            setPhotos(data);
            // onChange(prev => {
            //   return [...prev, ...data];
            // });
        }
    }

    function removePhoto(ev, filename) {
        ev.preventDefault();
        setPhotos(photos.filter(photo => photo !== filename));
        getPhotoByUrlAndDelete(filename);
        setIsPhotosDirty(true);
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            if (wareCategory3 != null) {
                let contrFilePath = '';
                let newWareImageIds: number[] = [];
                if (wareId === 0) {
                    if (rows.length > 0 || wareDetails.length > 0) {
                        contrFilePath = await postJsonConstructorFile(wareDetails, rows);
                        setStructureFilePath(contrFilePath);
                    }
                    const newWare = await createWare({
                        Article: article,
                        Name: name,
                        Description: description,
                        Price: price || 0,
                        Discount: discount || 0,
                        IsDeliveryAvailable: isDeliveryAvailable,
                        WareCategory3Id: wareCategory3.id,
                        TrademarkId: trademarkId,
                        StructureFilePath: contrFilePath
                    });

                    if (isPhotosDirty) {
                        // Додаємо нові зображення
                        const newPhotoPromises = photos.map(async (photo) => {
                            const newPhotoDTO = await postWareImage({
                                WareId: wareId,
                                Path: photo
                            });
                            return newPhotoDTO.id;
                        });

                        // Чекаємо завершення всіх операцій та оновлюємо newWareImageIds
                        newWareImageIds = await Promise.all(newPhotoPromises);
                    }
                } else {
                    console.log("trademarkId", trademarkId);
                    if (wareId) {
                        if ((rows.length > 0 || wareDetails.length > 0) && (!structureFilePath || structureFilePath === '')) {
                            contrFilePath = await postJsonConstructorFile(wareDetails, rows);
                            setStructureFilePath(contrFilePath);
                        }
                        if ((rows.length > 0 || wareDetails.length > 0) && structureFilePath.length > 0) {
                            contrFilePath = await putJsonConstructorFile(wareDetails, rows, structureFilePath);
                            setStructureFilePath(contrFilePath);
                        }
                        if (isPhotosDirty) {
                            console.log("Ми зайшли в блок isPhotosDirty");
                            console.log("imageIds", imageIds);

                            // Видаляємо існуючі зображення
                            await Promise.all(imageIds.map(async (imageId) => {
                                await deleteWareImage(imageId);
                            }));

                            // Додаємо нові зображення
                            const newPhotoPromises = photos.map(async (photo) => {
                                const newPhotoDTO = await postWareImage({
                                    WareId: wareId,
                                    Path: photo
                                });
                                return newPhotoDTO;
                            });

                            // Чекаємо завершення всіх операцій та оновлюємо newWareImageIds
                            let dtoS = await Promise.all(newPhotoPromises);
                            dtoS.sort((a, b) => photos.indexOf(a.path) - photos.indexOf(b.path));

                            newWareImageIds = dtoS.map(dto => dto.id);

                            console.log("newWareImageIds", newWareImageIds);
                            console.log("Ми вийшли з блока isPhotosDirty");
                        }

                        await updateWare({
                            Id: wareId,
                            Article: article,
                            Name: name,
                            Description: description,
                            Price: price || 0,
                            Discount: discount || 0,
                            IsDeliveryAvailable: isDeliveryAvailable,
                            WareCategory3Id: wareCategory3.id,
                            ReviewIds: reviewIds,
                            PriceHistoryIds: priceHistoryIds,
                            WareItemIds: wareItemIds,
                            OrderItemIds: orderItemIds,
                            TrademarkId: trademarkId,
                            CustomerFavoriteIds: customerFavoriteIds,
                            StructureFilePath: contrFilePath,
                            ImageIds: isPhotosDirty ? newWareImageIds : imageIds,
                            StatusIds: statusIds
                        });
                    }
                }
            }
        } catch (error) {
            toast.error('Виникла помилка при збереженні товару');
        } finally {
            setLoading(false);
            clearRows();
            setWareDetails("");
        }
    };

    const handleStatusChange = (statusId: number) => {
        setStatusIds((prevStatusIds) => {
            let updatedStatusIds = [...prevStatusIds];
            if (updatedStatusIds.includes(statusId)) {
                updatedStatusIds = updatedStatusIds.filter(id => id !== statusId);
            } else {
                updatedStatusIds.push(statusId);
            }

            if (updatedStatusIds.includes(1)) {
                setDiscount(0);
            }

            return updatedStatusIds;
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Typography variant="h5" color="textPrimary">
                {wareId === 0 ? 'Додати товар' : 'Редагування товару'}
            </Typography>

            <TextField
                label="Введіть артикул..."
                type="number"
                value={article}
                onChange={(e) => setArticle(parseInt(e.target.value))}
                fullWidth
                variant="outlined"
            />
            <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={wareCategory3 || null}
                onChange={(event, newValue) => setWareCategory3(newValue)}
                filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                    )
                }
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )}
                renderInput={(params) => <TextField {...params} label="Виберіть категорію" variant="outlined" />}
                isOptionEqualToValue={(option, value) => option.id === value?.id} // порівняння опцій за ID
            />

            <TextField
                label="Введіть назву товару..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant="outlined"
            />
            <TextField
                label="Введіть короткий опис товару..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="outlined"
            />
            <TextField
                label="Введіть ціну"
                type="number"
                value={price !== null ? price : ''}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                fullWidth
                variant="outlined"
            />

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusIds.includes(1)}
                            onChange={() => handleStatusChange(1)}
                            color="primary"
                        />
                    }
                    label="Завжди низька ціна"
                />
                <TextField
                    label="Введіть % знижки"
                    type="number"
                    value={discount !== null ? discount : ''}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    fullWidth
                    variant="outlined"
                    disabled={statusIds.includes(1)}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusIds.includes(3)}
                            onChange={() => handleStatusChange(3)}
                            color="primary"
                        />
                    }
                    label="Новинка"
                />
                <FormControlLabel
                    control={<Checkbox checked={isDeliveryAvailable} onChange={() => setIsDeliveryAvailable(!isDeliveryAvailable)} />}
                    label="Можлива доставка"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusIds.includes(2)}
                            onChange={() => handleStatusChange(2)}
                            color="primary"
                        />
                    }
                    label="Чудова пропозиція"
                />
            </Box>
            <InvoiceForm></InvoiceForm>

            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(!photos || photos.length === 0) && (
                    <label
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'transparent',
                            borderRadius: '1rem',
                            fontSize: '1.25rem',
                            color: '#718096',
                        }}
                    >
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                const files = event.target.files;
                                if (files && files.length > 5) {
                                    toast.warning("Ви можете завантажити не більше 5 фото товару.");
                                    event.target.value = ""; // Скидаємо вибір файлів
                                } else {
                                    UploadPhoto(event); // Викликаємо вашу функцію, якщо умова пройдена
                                }
                            }}
                            multiple
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '2rem', height: '2rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Завантажити фото
                    </label>
                )}
                {photos && photos.length > 0 && (
                    <div style={{ display: 'flex', position: 'static', gap: "15px", flexWrap: "wrap" }}>
                        {photos.map((photo, index) => (
                            <div key={index} style={{ position: "relative", display: "flex", alignItems: "center", flexBasis: "30%", flexDirection: "column" }}>
                                <img
                                    src={photo}
                                    alt={`Фото ${index + 1}`}
                                    style={{
                                        borderRadius: '1rem',
                                        objectFit: 'contain',
                                        height: '20vh',
                                        // width: '32%',
                                        overflowX: 'hidden',
                                    }}
                                />
                                <button
                                    onClick={(ev) => removePhoto(ev, photo)}
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        bottom: '0.5rem',
                                        right: '0.5rem',
                                        color: '#fff',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '1rem',
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
            <PhotoUploader photos={photos} setPhotos={setPhotos} UploadPhoto={UploadPhoto} removePhoto={removePhoto} />
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!name || !price}
                >
                    Зберегти
                </Button>
            )}
        </Box>
    );
}