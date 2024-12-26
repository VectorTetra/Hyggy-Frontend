import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares, WareGetDTO } from '@/pages/api/WareApi';
import { useWareItems } from '@/pages/api/WareItemApi';
import { putWareItem } from '@/pages/api/WareItemApi';
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

export default function FrameWriteoff() {
    const [selectedStore, setSelectedStore] = useState<Storage | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<WareGetDTO | null>(null);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
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

    const [quantityError, setQuantityError] = useState('');

    // Логика валидации количества
    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);

        if (value > availableQuantity) {
            setQuantityError(`В наявності тільки - ${availableQuantity}. Введіть інше значення.`);
            setQuantity(0);
        } else {
            setQuantityError(''); // Очищаем ошибку, если значение корректное
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

        if (!selectedStore || !selectedProduct || numericQuantity <= 0 || numericQuantity > availableQuantity) {
            toast.error('Будь ласка, заповніть всі поля або перевірте кількість!');
            return;
        }

        try {
            await putWareItem({
                Id: wareItems[0]?.id,
                StorageId: selectedStore.id,
                WareId: selectedProduct.id,
                Quantity: availableQuantity - numericQuantity,
            });

            toast.success('Списання відбулось успішно!');
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
                    Списання
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: "column", alignItems: 'stretch' }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            placeholder={`Доступно: ${availableQuantity}`}
                            disabled={!selectedProduct}
                            fullWidth
                            sx={{ flex: 1 }}
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
                        {/* Ошибка количества */}
                        {quantityError && (
                            <Typography sx={{
                                mt: 1,
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                fontSize: '0.775rem',
                            }} variant="body2" color="error">
                                {quantityError}
                            </Typography>
                        )}
                        {/* Общее сообщение о статусе */}
                        <Typography sx={{ mt: 1 }} variant="body2" color="textSecondary">
                            {statusMessage}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    fullWidth
                    disabled={!quantity || Number(quantity) <= 0 || Number(quantity) > availableQuantity}
                >
                    Зберегти
                </Button>
            </Box>
        </ThemeProvider>
    );
}