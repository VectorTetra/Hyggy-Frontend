import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import { useStorages } from '@/pages/api/StorageApi';
import { useWares } from '@/pages/api/WareApi';
import { useWareItems } from '@/pages/api/WareItemApi';
import { putWareItem } from '@/pages/api/WareItemApi';

export default function FrameWriteoff() {
    const [store, setStore] = useState(''); // Вибраний склад
    const [product, setProduct] = useState(''); // Вибраний товар
    const [availableQuantity, setAvailableQuantity] = useState(0); // Доступна кількість
    const [quantity, setQuantity] = useState(''); // Кількість для списання
    const [storeId, setStoreId] = useState(null); // ID складу
    const [productId, setProductId] = useState(null); // ID товару

    // Загружаємо список складів
    const { data: storages = [] } = useStorages({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    // Загружаємо список товарів
    const { data: wares = [] } = useWares({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    // Завантаження складів для обраного продукту
    const { data: wareItems = [], isLoading, isPending, isFetched, refetch } = useWareItems(
        { SearchParameter: "Query", StorageId: storeId, WareId: productId },
        false  // Запит активний лише якщо обрано склад і товар
    );

    const handleStoreChange = (event, value) => {
        const selectedStore = storages.find((s) => `${s.shopName ? s.shopName : "Загальний склад"} - ${s.city}, ${s.street} ${s.houseNumber}` === value);
        setStore(value || '');
        setStoreId(selectedStore ? selectedStore.id : null);
        setAvailableQuantity(0);
    };

    const handleProductChange = (event, value) => {
        const selectedProduct = wares.find((w) => w.description === value);
        setProduct(value || '');
        setProductId(selectedProduct ? selectedProduct.id : null);
        setAvailableQuantity(0);
    };
    useEffect(() => {
        // Оновлюємо доступну кількість
        if (store !== null && product !== null) {
            refetch();
        } else {
            setAvailableQuantity(0);
        }
    }, [product, store]);
    useEffect(() => {
        // Оновлюємо доступну кількість
        if (wareItems.length > 0) {
            setAvailableQuantity(wareItems[0].quantity);
            console.log("handleProductChange", wareItems[0].quantity);

        } else {
            setAvailableQuantity(0);
        }
    }, [wareItems]);

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        if (Number(value) > availableQuantity) {
            toast.error(`В наявності тільки - ${availableQuantity}. Введіть інше значення.`);
            setQuantity('0'); // Используем строку '0'
        } else {
            setQuantity(value);
        }
    };

    const handleSave = async () => {
        const numericQuantity = Number(quantity);

        if (!store || !product || numericQuantity <= 0 || numericQuantity > availableQuantity) {
            toast.error('Будь ласка, заповніть всі поля або перевірте кількість!');
            return;
        }

        if (!storeId || !productId) {
            toast.error('Будь ласка, оберіть склад та товар!');
            return;
        }

        try {
            // Обновление количества товара
            const updatedItem = await putWareItem({
                Id: wareItems[0]?.id,
                StorageId: storeId,
                WareId: productId,
                Quantity: availableQuantity - numericQuantity,
            });

            toast.success('Списання відбулось успішно!');
            console.log('Updated WareItem:', updatedItem);

            // Очистка полей после успешного обновления
            setStore('');
            setProduct('');
            setAvailableQuantity(0);
            setQuantity('');
        } catch (error) {
            console.error(error.message);
            toast.error('Не вдалося оновити кількість. Спробуйте ще раз!');
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
                Списання товарів
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
                <Autocomplete
                    value={store}
                    onChange={handleStoreChange}
                    options={storages.map((s) => `${s.shopName ? s.shopName : "Загальний склад"} - ${s.city}, ${s.street} ${s.houseNumber}`)}
                    renderInput={(params) => <TextField {...params} label="Виберіть склад" variant="outlined" fullWidth />}
                    sx={{ flex: 2 }}
                />
                <Autocomplete
                    value={product}
                    onChange={handleProductChange}
                    options={wares.map((p) => p.description)}
                    renderInput={(params) => <TextField {...params} label="Виберіть товар" variant="outlined" fullWidth />}
                    sx={{ flex: 2 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <TextField
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        placeholder={`Доступно: ${availableQuantity}`}
                        disabled={!product}
                        fullWidth
                        sx={{ flex: 1, maxWidth: 150 }}
                    />
                    {(!store || !product) && <Typography sx={{ mt: 1 }} variant="body2" color="textSecondary">
                        Виберіть склад і товар
                    </Typography>}
                    {isLoading && <Typography sx={{ mt: 1 }} variant="body2" color="textSecondary">
                        Завантаження...
                    </Typography>}
                    {store && product && !isLoading && <Typography sx={{ mt: 1 }} variant="body2" color="textSecondary">
                        Всього в наявності - {availableQuantity}
                    </Typography>}
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!quantity || Number(quantity) <= 0 || Number(quantity) > availableQuantity}
            >
                Зберегти
            </Button>
        </Box>
    );
}
