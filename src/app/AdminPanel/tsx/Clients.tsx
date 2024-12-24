import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { useCustomers, useDeleteCustomer } from '@/pages/api/CustomerApi';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Clients = ({ rolePermissions }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
    const { data: data = [], isLoading: dataLoading } = useCustomers({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000
    });
    const { mutate: deleteCustomer } = useDeleteCustomer();
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const apiRef = useGridApiRef();

    // Фільтрація даних на основі швидкого пошуку
    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const handleDelete = (row) => {
        // Встановлюємо рядок для видалення та відкриваємо діалог
        console.log("row", row);
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedRow) {
            console.log("selectedRow", selectedRow);
            await deleteCustomer(selectedRow.id);
            setIsDialogOpen(false);
            toast.info('Користувача успішно видалено!');
        }
    };
    let columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        { field: 'name', headerName: "Ім'я", flex: 1, minWidth: 200 },
        { field: 'surname', headerName: 'Прізвище', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Пошта', flex: 0.8, minWidth: 150 },
        { field: 'phoneNumber', headerName: 'Телефон', flex: 1, minWidth: 150 },
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
        },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0,
            width: 75,
            cellClassName: 'text-center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
                    <Button sx={{ minWidth: "10px", padding: 0 }} color='secondary' title='Видалити' variant="outlined" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

    if (!rolePermissions.IsFrameClients_Cell_ExecutedOrdersSum_Available) {
        columns = columns.filter(column => column.field !== 'executedOrdersSum');
    }
    if (!rolePermissions.IsFrameClients_Cell_ExecutedOrdersAvg_Available) {
        columns = columns.filter(column => column.field !== 'executedOrdersAvg');
    }
    if (!rolePermissions.IsFrameClients_Cell_Actions_Available) {
        columns = columns.filter(column => column.field !== 'actions');
    }

    // Функція для форматування значення
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    return (
        <Box sx={{ width: '100%' }}>
            <ThemeProvider theme={themeFrame}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Клієнти
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
                <Box sx={{ overflowX: 'auto', maxWidth: process.env.NEXT_PUBLIC_ADMINPANEL_BOX_DATAGRID_MAXWIDTH }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
                    <DataGrid
                        rows={filteredData} // Використовуємо відфільтровані дані
                        columns={columns}
                        apiRef={apiRef}
                        loading={dataLoading}
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
                            noRowsLabel: 'Користувачів не знайдено',
                            noResultsOverlayLabel: 'Результатів не знайдено',
                            footerRowSelected: (count) => `Вибрано рядків: ${count}`,
                            MuiTablePagination: {
                                labelRowsPerPage: 'Рядків на сторінці',
                            },
                        }}
                    />
                </Box>
            </ThemeProvider>
            <ConfirmationDialog
                title="Видалити користувача?"
                contentText={
                    selectedRow
                        ? `Ви справді хочете видалити цього користувача? : 
            ${selectedRow.name && `${selectedRow.name} `} 
            ${selectedRow.surname && `${selectedRow.surname},`} 
                    ${selectedRow.email && `${selectedRow.email},`} `
                        : ''
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDialogOpen(false)}
                confirmButtonBackgroundColor='#00AAAD'
                cancelButtonBackgroundColor='#fff'
                cancelButtonBorderColor='#be0f0f'
                cancelButtonColor='#be0f0f'
                open={isDialogOpen}
            />
        </Box>
    )
}

export default Clients