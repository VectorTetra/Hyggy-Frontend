import { Box, Button, TextField, Typography, CircularProgress, FormControlLabel, Checkbox, Select, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { useCreateWare, useUpdateWare, getWares } from '@/pages/api/WareApi';
import { toast } from 'react-toastify';
import { useQueryState } from 'nuqs';
import { getWareCategories3, useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import InvoiceForm from './InvoiceForm';
import { useSearchParams } from 'next/navigation';

export default function WareAddEditFrame() {
    const { data: categories = [], isLoading: categoriesLoading, isSuccess: categoriesSuccess } = useWareCategories3({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc"
    });

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
    const [reviewIds, setReviewIds] = useState<number[]>([]);
    const [statusIds, setStatusIds] = useState<number[]>([]);
    const [priceHistoryIds, setPriceHistoryIds] = useState<number[]>([]);
    const [wareItemIds, setWareItemIds] = useState<number[]>([]);
    const [orderItemIds, setOrderItemIds] = useState<number[]>([]);
    const [trademarkId, setTrademarkId] = useState<number | null>(null);
    const [customerFavoriteIds, setCustomerFavoriteIds] = useState<string[]>([]);
    const [imageIds, setImageIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
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

    const handleSave = async () => {
        setLoading(true);
        try {
            if (wareCategory3 != null) {

                if (wareId === 0) {
                    await createWare({
                        Article: article,
                        Name: name,
                        Description: description,
                        Price: price || 0,
                        Discount: discount || 0,
                        IsDeliveryAvailable: isDeliveryAvailable,
                        WareCategory3Id: wareCategory3.id,
                        TrademarkId: trademarkId,
                        StructureFilePath: structureFilePath
                    });
                } else {
                    console.log("trademarkId", trademarkId);
                    if (wareId) {
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
                            StructureFilePath: structureFilePath,
                            ImageIds: imageIds,
                            StatusIds: statusIds
                        });

                    }
                }
            }
        } catch (error) {
            toast.error('Виникла помилка при збереженні товару');
        } finally {
            setLoading(false);
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