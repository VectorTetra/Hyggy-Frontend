import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares, WareGetDTO } from '@/pages/api/WareApi';
import { useWareItems } from '@/pages/api/WareItemApi';
import { putWareItem, postWareItem } from '@/pages/api/WareItemApi';
import { ThemeProvider } from '@mui/material';
import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';
import { useQueryState } from 'nuqs';

const StorageSelector = ({ storages, selectedStore, onChange }) => (
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
        renderInput={(params) => <TextField {...params} label="Виберіть склад" variant="outlined" fullWidth />}
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

export default function FrameSupply() {
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
    const [selectedStore, setSelectedStore] = useState<Storage | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<WareGetDTO | null>(null);
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
        { SearchParameter: 'Query', StorageId: selectedStore?.id, WareId: selectedProduct?.id },
        false // Запит активний лише якщо обрано склад і товар
    );

    useEffect(() => {
        if (selectedStore?.id && selectedProduct?.id) {
            refetch();
        } else {
            setAvailableQuantity(0);
        }
    }, [selectedStore, selectedProduct, refetch]);

    useEffect(() => {
        if (wareItems.length > 0) {
            setAvailableQuantity(wareItems[0].quantity);
        } else {
            setAvailableQuantity(0);
        }
    }, [wareItems]);

    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);

        if (value < 0) {
            toast.error('Кількість не може бути негативною!');
            setQuantity(0);
        } else {
            setQuantity(value);
        }
    };

    const resetForm = () => {
        setSelectedStore(null);
        setSelectedProduct(null);
        setAvailableQuantity(0);
        setQuantity(0);
    };

    const handleSave = async () => {
        const numericQuantity = Number(quantity);

        if (!selectedStore || !selectedProduct || numericQuantity <= 0) {
            toast.error('Будь ласка, заповніть всі поля або введіть правильну кількість!');
            return;
        }

        try {
            if (wareItems.length > 0 && wareItems[0]?.id) {
                // Обновление существующего объекта
                await putWareItem({
                    Id: wareItems[0].id,
                    StorageId: selectedStore.id,
                    WareId: selectedProduct.id,
                    Quantity: availableQuantity + numericQuantity, // Увеличение количества
                });
            } else {
                // Создание нового объекта
                await postWareItem({
                    StorageId: selectedStore.id,
                    WareId: selectedProduct.id,
                    Quantity: numericQuantity, // Установка количества
                });
            }

            toast.success('Поставка відбулась успішно!');
            resetForm();
            setActiveTab('remains');
        } catch (error) {
            toast.error('Не вдалося оновити кількість. Спробуйте ще раз!');
        }
    };


    const statusMessage = useMemo(() => {
        if (!selectedStore || !selectedProduct) return 'Виберіть склад і товар';
        if (isLoading) return 'Завантаження...';
        return `Всього в наявності - ${availableQuantity}`;
    }, [selectedStore, selectedProduct, isLoading, availableQuantity]);

    return (
        <ThemeProvider theme={themeFrame}>
            <Box>
                <Typography sx={{ mb: 2 }} variant="h5" gutterBottom>
                    Поставка товарів
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, mb: 4, alignItems: 'stretch' }}>
                    <StorageSelector
                        storages={storages}
                        selectedStore={selectedStore}
                        onChange={(event, value) => {
                            const store = storages.find(
                                (s) =>
                                    `${s.shopName || 'Загальний склад'} - ${s.city}, ${s.street} ${s.houseNumber}` === value
                            );
                            setSelectedStore(store || null);
                        }}
                    />
                    <ProductSelector
                        wares={wares}
                        selectedProduct={selectedProduct}
                        onChange={(event, value) => {
                            const product = wares.find((w) => w.description === value);
                            setSelectedProduct(product || null);
                        }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder="Кількість"
                            disabled={!selectedProduct}
                            fullWidth
                            sx={{ flex: 1 }}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 0, // мінімальне значення
                                        step: 1, // крок введення (опціонально)
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
                    onClick={handleSave}
                    disabled={!quantity || Number(quantity) <= 0}
                    fullWidth
                >
                    Зберегти
                </Button>
            </Box>
        </ThemeProvider>
    );
}
