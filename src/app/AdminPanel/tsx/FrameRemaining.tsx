import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography, CircularProgress, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import { useStorages } from '@/pages/api/StorageApi';
import { useShops } from '@/pages/api/ShopApi';
import { useWares } from '@/pages/api/WareApi';


import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { useQueryState } from 'nuqs';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
import StarRating from '@/app/sharedComponents/StarRating';

export default function FrameRemaining() {
    const [store, setStore] = useState('');
    const [product, setProduct] = useState('');
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [activeNewWare, setActiveNewWare] = useQueryState("new-edit", { clearOnDefault: true, scroll: false, history: "push", shallow: true });

    // Загружаем список складов через API
    const { data: shops = [], isLoading: shopsLoading } = useShops({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    const { data: wares = [], isLoading: waresLoading } = useWares({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    const handleStoreChange = (event, value) => {
        setStore(value || '');
        setAvailableQuantity(0);
    };

    const handleProductChange = (event, value) => {
        setProduct(value || '');
        setAvailableQuantity(0);
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        // Проверяем, что введенное значение является числом или пустой строкой
        if (value === '' || !isNaN(value)) {
            const numericValue = Number(value);

            // Если значение больше нуля и меньше или равно доступному количеству
            if (numericValue <= availableQuantity) {
                setQuantity(value); // Обновляем состояние
            }
        }
    };

    const handleSave = () => {
        const numericQuantity = Number(quantity);
        if (!store || !product || numericQuantity <= 0 || numericQuantity > availableQuantity) {
            toast.error('Будь ласка, заповніть всі поля або перевірте кількість!');
            return;
        }

        setIsLoading(true);

        // Отправки данных (для наглядности)
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Списання відбулось успішно!');
            setStore('');
            setProduct('');
            setAvailableQuantity(0);
            setQuantity('');
        }, 1000);
    };

    const [filteredData, setFilteredData] = useState<any | null>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [loading, setLoading] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        price: false,
        discount: false,
    });
    const apiRef = useGridApiRef();
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", clearOnDefault: true, scroll: false, history: "push", shallow: true });

    // Функція для форматування значення
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    const columns = [
        { field: 'name', headerName: 'Назва товару', flex: 1, minWidth: 200 },
        { field: 'category', headerName: 'Категорія', flex: 1, minWidth: 150 },
        {
            field: 'executedOrdersSum',
            headerName: 'Заг. сума товарів',
            flex: 0.5,
            cellClassName: 'text-right',
            renderCell: (params) => formatCurrency(params.value),
        },
    ]

    return (
        <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
                Залишки
            </Typography>
            <Box>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    alignItems: 'center',
                    gap: 3,
                }}>
                    <SearchField
                        searchTerm={searchTerm}
                        onSearchChange={(event) => setSearchTerm(event.target.value)}
                    />

                    {/* Поле для выбора склада*/}
                    <Autocomplete
                        value={store}
                        onChange={handleStoreChange}
                        options={shops.map((s) => s.name)}
                        renderInput={(params) => (
                            <TextField {...params} label="Виберіть склад" variant="outlined" fullWidth />
                        )}
                    />

                    <Autocomplete
                        value={product}
                        onChange={handleProductChange}
                        options={wares
                            .map((p) => p.wareCategory2Name)
                            .filter((category, index, array) => array.indexOf(category) === index)}
                        renderInput={(params) => (
                            <TextField {...params} label="Виберіть категорію" variant="outlined" fullWidth />
                        )}
                    />
                </Box>
            </Box>
            <DataGrid sx={{ mt: 3 }}
                columns={columns} />
        </Box>

    );
}
