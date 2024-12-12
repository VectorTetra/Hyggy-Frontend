import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares, Ware } from '@/pages/api/WareApi';
import { useWareItems } from '@/pages/api/WareItemApi';
import { putWareItem, postWareItem, getWareItems } from '@/pages/api/WareItemApi';
import { ThemeProvider } from '@mui/material';
import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';

const StorageSelector = ({ storages, selectedStore, onChange, label }) => (
    <Autocomplete
        sx={{ flex: 2 }}
        value={
            selectedStore
                ? `${selectedStore.shopName || 'Загальний склад'} - ${selectedStore.city}, ${selectedStore.street} ${selectedStore.houseNumber}`
                : ''
        }
        onChange={onChange}
        options={storages.map(
            (s) => `${s.shopName || 'Загальний склад'} - ${s.city}, ${s.street} ${s.houseNumber}`
        )}
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" fullWidth />}
    />
);

const ProductSelector = ({ wares, selectedProduct, onChange }) => (
    <Autocomplete
        sx={{ flex: 2 }}
        value={selectedProduct?.description || ''}
        onChange={onChange}
        options={wares.map((w) => w.description)}
        renderInput={(params) => <TextField {...params} label="Виберіть товар" variant="outlined" fullWidth />}
    />
);

export default function FrameTransfer() {
    const [fromStore, setFromStore] = useState<Storage | null>(null);
    const [toStore, setToStore] = useState<Storage | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Ware | null>(null);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [quantity, setQuantity] = useState(0);

    // Завантаження складів і товарів
    const { data: storages = [] } = useStorages({
        SearchParameter: 'Query',
        PageNumber: 1,
        PageSize: 1000,
    });

    const { data: wares = [] } = useWares({
        SearchParameter: 'Query',
        PageNumber: 1,
        PageSize: 1000,
    });

    // Завантаження складів для обраного продукту
    const { data: wareItems = [], refetch, isLoading } = useWareItems(
        { SearchParameter: 'Query', StorageId: fromStore?.id, WareId: selectedProduct?.id },
        false // Запит активний лише якщо обрано склад і товар
    );

    useEffect(() => {
        if (fromStore?.id && selectedProduct?.id) {
            refetch();
        } else {
            setAvailableQuantity(0);
        }
    }, [fromStore, selectedProduct, refetch]);

    useEffect(() => {
        if (wareItems.length > 0) {
            setAvailableQuantity(wareItems[0].quantity);
        } else {
            setAvailableQuantity(0);
        }
    }, [wareItems]);

    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);
        const toastId = "quantityErrorToast"; // Унікальний ID для тосту

        if (value > availableQuantity) {
            if (!toast.isActive(toastId)) {
                toast.error(`В наявності тільки - ${availableQuantity}. Введіть інше значення.`, {
                    toastId, // Встановлюємо унікальний ID для тосту
                    autoClose: false,
                });
            }
            setQuantity(0);
        } else {
            toast.dismiss(toastId); // Закриваємо тост, якщо помилка виправлена
            setQuantity(value);
        }
    };

    const resetForm = () => {
        setFromStore(null);
        setToStore(null);
        setSelectedProduct(null);
        setAvailableQuantity(0);
        setQuantity(0);
    };

    const handleTransfer = async () => {
        const numericQuantity = Number(quantity);

        if (!fromStore || !toStore || !selectedProduct || numericQuantity <= 0 || numericQuantity > availableQuantity) {
            toast.error('Будь ласка, заповніть всі поля або перевірте кількість!');
            return;
        }

        if (fromStore.id === toStore.id) {
            toast.error('Виберіть різні склади для переміщення!');
            return;
        }

        try {
            // Списання з початкового складу
            await putWareItem({
                Id: wareItems[0]?.id,
                StorageId: fromStore.id,
                WareId: selectedProduct.id,
                Quantity: availableQuantity - numericQuantity,
            });

            // Пошук товару на цільовому складі
            const destinationWareItems = await getWareItems({
                SearchParameter: 'Query',
                StorageId: toStore.id,
                WareId: selectedProduct.id
            });

            if (destinationWareItems.length > 0 && destinationWareItems[0]?.id) {
                // Оновлення кількості на цільовому складі
                await putWareItem({
                    Id: destinationWareItems[0].id,
                    StorageId: toStore.id,
                    WareId: selectedProduct.id,
                    Quantity: destinationWareItems[0].quantity + numericQuantity,
                });
            } else {
                // Створення нового запису на цільовому складі
                await postWareItem({
                    StorageId: toStore.id,
                    WareId: selectedProduct.id,
                    Quantity: numericQuantity,
                });
            }

            toast.success('Переміщення товару відбулось успішно!');
            resetForm();
        } catch (error) {
            console.error('Повна інформація про помилку:', error);
            toast.error(`Не вдалося перемістити товар: ${error.message || 'Невідома помилка'}`);
        }
    };

    const statusMessage = useMemo(() => {
        if (!fromStore || !selectedProduct) return 'Виберіть склад і товар';
        if (isLoading) return 'Завантаження...';
        return `Всього в наявності - ${availableQuantity}`;
    }, [fromStore, selectedProduct, isLoading, availableQuantity]);

    return (
        <ThemeProvider theme={themeFrame}>
            <Box sx={{ p: 2 }}>
                <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
                    Переміщення товарів між складами
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
                    <StorageSelector
                        storages={storages}
                        selectedStore={fromStore}
                        onChange={(event, value) => {
                            const store = storages.find(
                                (s) =>
                                    `${s.shopName || 'Загальний склад'} - ${s.city}, ${s.street} ${s.houseNumber}` === value
                            );
                            setFromStore(store || null);
                        }}
                        label="Склад відправлення"
                    />
                    <ProductSelector
                        wares={wares}
                        selectedProduct={selectedProduct}
                        onChange={(event, value) => {
                            const product = wares.find((w) => w.description === value);
                            setSelectedProduct(product || null);
                        }}
                    />
                    <StorageSelector
                        storages={storages}
                        selectedStore={toStore}
                        onChange={(event, value) => {
                            const store = storages.find(
                                (s) =>
                                    `${s.shopName || 'Загальний склад'} - ${s.city}, ${s.street} ${s.houseNumber}` === value
                            );
                            setToStore(store || null);
                        }}
                        label="Склад призначення"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder={`Доступно: ${availableQuantity}`}
                            disabled={!selectedProduct}
                            fullWidth
                            sx={{ flex: 1, maxWidth: 150 }}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 0,
                                        max: availableQuantity,
                                        step: 1,
                                    }
                                },
                            }}
                        />
                        <Typography sx={{ mt: 1 }} variant="body2" color="textSecondary">
                            {statusMessage}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTransfer}
                    disabled={!quantity || Number(quantity) <= 0 ||
                        Number(quantity) > availableQuantity ||
                        !fromStore ||
                        !toStore ||
                        fromStore.id === toStore.id
                    }
                >
                    Перемістити
                </Button>
            </Box>
        </ThemeProvider>
    );
}