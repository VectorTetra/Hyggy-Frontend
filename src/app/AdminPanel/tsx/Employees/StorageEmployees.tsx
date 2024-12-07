import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { getStorageEmployees, deleteStorageEmployee } from '@/pages/api/EmployeesApi';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00AAAD',
            contrastText: 'white',
        },
    },
});

const StorageEmployees = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
    const [data, setData] = useState<any | null>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", clearOnDefault: true, scroll: false, history: "push", shallow: true });
    const [activeNewShopEmployee, setActiveNewShopEmployee] = useQueryState("storageemployee", { scroll: false, history: "push", shallow: true });
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const apiRef = useGridApiRef();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employees = await getStorageEmployees();
                if (!employees) {
                    console.log('Користувачів не знайдено');
                    return;
                }
                console.log(employees);
                setData(employees);
            } catch (error) {
                console.error('Error fetching storage data:', error);
            } finally {
                setLoading(false);
                setActiveNewShopEmployee(null);
            }
        };

        fetchEmployees();
    }, []);
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
            await deleteStorageEmployee(selectedRow.id);
            setIsDialogOpen(false);

            setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
            toast.info('Співробітника успішно видалено!');
        }
    };
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        { field: 'name', headerName: "Ім'я", flex: 1, minWidth: 200 },
        { field: 'surname', headerName: 'Прізвище', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Пошта', flex: 0.8, minWidth: 150 },
        { field: 'phone', headerName: 'Телефон', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0.5,
            minWidth: 75,
            cellClassName: 'text-center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
                    <Button sx={{ minWidth: "10px", padding: 0 }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Співробітники складів
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        label="Швидкий пошук"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан для швидкого пошуку
                    />
                    <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={() => { setActiveNewShopEmployee('0'); setActiveTab('addStorageEmployee') }}>
                        Додати
                    </Button>
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
                            noRowsLabel: 'Співробітників не знайдено',
                            noResultsOverlayLabel: 'Результатів не знайдено',
                            footerRowSelected: (count) => `Вибрано рядків: ${count}`,
                            MuiTablePagination: {
                                labelRowsPerPage: 'Рядків на сторінці',
                            },
                        }}
                    />
                </Box>
                <ConfirmationDialog
                    title="Видалити співробітника?"
                    contentText={
                        selectedRow
                            ? `Ви справді хочете видалити цього співробітника? : 
            ${selectedRow.name && `${selectedRow.name} `} 
            ${selectedRow.surname && `${selectedRow.surname},`} 
                    ${selectedRow.email && `${selectedRow.email},`} `
                            : ''
                    }
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDialogOpen(false)}
                    confirmButtonColor='#be0f0f'
                    cancelButtonColor='#248922'
                    open={isDialogOpen}
                />
            </Box>

        </ThemeProvider>
    )
}

export default StorageEmployees