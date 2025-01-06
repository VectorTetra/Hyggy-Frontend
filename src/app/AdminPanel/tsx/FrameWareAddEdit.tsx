import { getPhotoByUrlAndDelete, uploadPhotos } from '@/pages/api/ImageApi';
import { getJsonConstructorFile, getWares, postJsonConstructorFile, putJsonConstructorFile, useCreateWare, useUpdateWare } from '@/pages/api/WareApi';
import { getWareCategories3, useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import { deleteWareImage, postWareImage } from '@/pages/api/WareImageApi';
import { useCreateWareHistory, useWarePriceHistories } from '@/pages/api/WarePriceHistoryApi';
import useAdminPanelStore from '@/store/adminPanel';
import useInvoiceStore from '@/store/invoiceStore';
import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from '@mui/material';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InvoiceForm from './FrameWareInvoiceForm';
import PhotoUploader from './PhotoUploader';
import { ThemeProvider } from '@mui/material';
import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';

export default function WareAddEditFrame() {
    const wareId = useAdminPanelStore((state) => state.wareId);

    const { data: categories = [] } = useWareCategories3({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc"
    });
    const { data: priceHistories = [] } = useWarePriceHistories({
        SearchParameter: "Query",
        WareId: wareId,
        Sorting: "EffectiveDateDesc",
        PageNumber: 1,
        PageSize: 1
    }, wareId !== null && wareId > 0);

    const { rows, clearRows, setRows, wareDetails, setWareDetails } = useInvoiceStore();
    const { mutateAsync: createWare } = useCreateWare();
    const { mutateAsync: createPriceHistory } = useCreateWareHistory();
    const { mutateAsync: updateWare } = useUpdateWare();


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
        console.log("photos", photos);
    }, [photos]);

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
                    else {
                        clearRows();
                        setWareDetails("");
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
        else if (wareId === 0) {
            clearRows();
            setWareDetails("");
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
            const data = await uploadPhotos(files);
            setPhotos([...photos, ...data]);
        }
    }

    async function removePhoto(filename) {
        setIsPhotosDirty(true);
        setPhotos(photos.filter(photo => photo !== filename));
        await getPhotoByUrlAndDelete(filename);
    }

    const handleSave = async () => {
        if (photos.length === 0) {
            toast.error('Додайте хоча б одне фото товару, щоб його зберегти');
            return;
        }
        setLoading(true);
        try {
            if (wareCategory3 != null) {
                let contrFilePath = '';
                let newWareImageIds: number[] = [];
                if (wareId === 0) {

                    contrFilePath = await postJsonConstructorFile(wareDetails, rows);
                    setStructureFilePath(contrFilePath);

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
                    const newWarePriceHistory = await createPriceHistory({
                        WareId: newWare.id,
                        EffectiveDate: new Date(),
                        Price: (price - (price * (discount / 100))) || 0
                    });
                    if (isPhotosDirty) {
                        // Додаємо нові зображення
                        const newPhotoPromises = photos.map(async (photo) => {
                            const newPhotoDTO = await postWareImage({
                                WareId: newWare.id,
                                Path: photo
                            });
                            return newPhotoDTO.id;
                        });

                        // Чекаємо завершення всіх операцій та оновлюємо newWareImageIds
                        newWareImageIds = await Promise.all(newPhotoPromises);
                    }
                    toast.success('Товар успішно створено!');

                } else {
                    console.log("trademarkId", trademarkId);
                    console.log("wareDetails", wareDetails);
                    console.log("rows", rows);
                    if (wareId) {

                        if ((!structureFilePath || structureFilePath === '')) {
                            contrFilePath = await postJsonConstructorFile(wareDetails, rows);
                            setStructureFilePath(contrFilePath);
                        }
                        if (structureFilePath.length > 0) {
                            contrFilePath = await putJsonConstructorFile(wareDetails, rows, structureFilePath);
                            setStructureFilePath(contrFilePath);
                            console.log("Ми зайшли в блок structureFilePath.length > 0");
                        }
                        if (isPhotosDirty) {
                            console.log("Ми зайшли в блок isPhotosDirty");
                            console.log("imageIds", imageIds);

                            // Видаляємо існуючі зображення
                            for (const imageId of imageIds) {
                                await deleteWareImage(imageId);
                            }

                            // Додаємо нові зображення по одному
                            for (const photo of photos) {
                                const newPhotoDTO = await postWareImage({
                                    WareId: wareId,
                                    Path: photo
                                });
                                newWareImageIds.push(newPhotoDTO.id);
                            }

                            console.log("newWareImageIds", newWareImageIds);
                            console.log("Ми вийшли з блока isPhotosDirty");
                        }

                        const updatedWare = await updateWare({
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
                        if (priceHistories.length > 0 && priceHistories[0].price !== price) {
                            const newWarePriceHistory = await createPriceHistory({
                                WareId: wareId,
                                EffectiveDate: new Date(),
                                Price: (price - (price * (discount / 100))) || 0
                            });
                        }

                        toast.success('Товар успішно оновлено!');
                    }
                }
            }
        } catch (error) {
            console.error('Error saving ware:', error);
            toast.error('Виникла помилка при збереженні товару');
        } finally {
            setLoading(false);
            clearRows();
            setWareDetails("");
            setActiveTab('products');
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
        <ThemeProvider theme={themeFrame}>
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
                    getOptionLabel={(option) => option.name!}
                    value={wareCategory3 || null}
                    onChange={(event, newValue) => setWareCategory3(newValue)}
                    filterOptions={(options, { inputValue }) =>
                        options.filter((option) =>
                            option.name!.toLowerCase().includes(inputValue.toLowerCase())
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
                <PhotoUploader photos={photos} setPhotos={setPhotos} UploadPhoto={UploadPhoto} removePhoto={removePhoto} setIsPhotosDirty={setIsPhotosDirty} />
                {loading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Button sx={{ backgroundColor: "#00AAAD" }}
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!name || !price || !wareCategory3}
                    >
                        Зберегти
                    </Button>
                )}
            </Box>
        </ThemeProvider>
    );
}