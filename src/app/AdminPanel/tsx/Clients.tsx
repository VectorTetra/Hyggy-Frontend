import React, { useEffect, useState } from 'react';
import { Box, Button, circularProgressClasses, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel } from '@mui/x-data-grid';

type Customer = {
    name: string;
    surname: string;
    email: string;
    phone: string;
    executedOrderSum: number;
    executedOrdersAvg: number;
}

const Clients = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiRef = useGridApiRef();

    // Фільтрація даних на основі швидкого пошуку
    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        { field: 'name', headerName: "Ім'я", flex: 1, minWidth: 200 },
        { field: 'surname', headerName: 'Прізвище', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Пошта', flex: 0.8, minWidth: 150 },
        { field: 'phone', headerName: 'Телефон', flex: 1, minWidth: 150 },
        {
            field: 'executedOrdersSum',
            headerName: 'Заг. сума замовлень',
            flex: 0.5,
            cellClassName: 'text-right',
            renderCell: (params) => formatCurrency(params.value),
        },
        {
            field: 'executedOrdersAvg',
            headerName: 'Середня сума замовлень',
            flex: 0.5,
            cellClassName: 'text-right',
            renderCell: (params) => formatCurrency(params.value),
        }
    ];
    // Функція для форматування значення
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Магазини
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    label="Швидкий пошук"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан для швидкого пошуку
                />
            </Box>
            <Box sx={{ overflowX: 'auto' }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
                <DataGrid
                    rows={filteredData} // Використовуємо відфільтровані дані
                    columns={columns}
                    apiRef={apiRef}
                    loading={loading}
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    localeText={{
                        filterOperatorContains: 'Містить',
                        filterOperatorDoesNotContain: 'Не містить',
                        filterOperatorEquals: 'Дорівнює',
                        filterOperatorDoesNotEqual: 'Не дорівнює',
                        filterOperatorStartsWith: 'Починається з',
                        filterOperatorIsAnyOf: 'Є одним з',
                        filterOperatorEndsWith: 'Закінчується на',
                        filterOperatorIs: 'Дорівнює',
                        filterOperatorNot: 'Не дорівнює',
                        filterOperatorAfter: 'Після',
                        filterOperatorOnOrAfter: 'Після або в цей день',
                        filterOperatorBefore: 'До',
                        filterOperatorOnOrBefore: 'До або в цей день',
                        filterOperatorIsEmpty: 'Пусто',
                        filterOperatorIsNotEmpty: 'Не пусто',
                        columnMenuLabel: 'Меню стовпця',
                        columnMenuShowColumns: 'Показати стовпці',
                        columnMenuFilter: 'Фільтр',
                        columnMenuHideColumn: 'Приховати стовпець',
                        columnMenuUnsort: 'Скасувати сортування',
                        columnMenuSortAsc: 'Сортувати за зростанням',
                        columnMenuSortDesc: 'Сортувати за спаданням',
                        toolbarDensity: 'Щільність',
                        toolbarDensityLabel: 'Щільність',
                        toolbarDensityCompact: 'Компактно',
                        toolbarDensityStandard: 'Стандарт',
                        toolbarDensityComfortable: 'Комфортно',
                        toolbarColumns: 'Стовпці',
                        toolbarColumnsLabel: 'Вибрати стовпці',
                        toolbarFilters: 'Фільтри',
                        toolbarFiltersLabel: 'Показати фільтри',
                        toolbarFiltersTooltipHide: 'Сховати фільтри',
                        toolbarFiltersTooltipShow: 'Показати фільтри',
                        toolbarExport: 'Експорт',
                        toolbarExportLabel: 'Експорт',
                        toolbarExportCSV: 'Завантажити як CSV',
                        toolbarExportPrint: 'Друк',
                        noRowsLabel: 'Немає даних',
                        noResultsOverlayLabel: 'Результатів не знайдено',
                        footerRowSelected: (count) => `Вибрано рядків: ${count}`,
                        MuiTablePagination: {
                            labelRowsPerPage: 'Рядків на сторінці',
                        },
                    }}
                />
            </Box>
        </Box>


    )
}

export default Clients