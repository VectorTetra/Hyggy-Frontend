import themeFrame from '@/app/AdminPanel/tsx/ThemeFrame';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { useShopEmployeeDelete, useStorageEmployees } from '@/pages/api/EmployeesApi';
import useAdminPanelStore from '@/store/adminPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, TextField, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

const StorageEmployees = ({ rolePermissions }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [filteredData, setFilteredData] = useState<any | null>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", clearOnDefault: true, scroll: false, history: "push", shallow: true });
    const { setStorageEmployeeId } = useAdminPanelStore();
    //const [activeNewShopEmployee, setActiveNewShopEmployee] = useQueryState("storageemployee", { scroll: false, history: "push", shallow: true });
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const apiRef = useGridApiRef();
    const { mutateAsync: deleteStorageEmployee } = useShopEmployeeDelete();
    // Завантаження даних
    const { data: storageEmployees = [], isFetching: dataLoading, refetch } = useStorageEmployees({
        PageNumber: 1,
        PageSize: 1000,
        QueryAny: debouncedSearchTerm ?? null,
    });

    useEffect(() => {
        refetch();
    }, [debouncedSearchTerm, refetch]);

    const handleEdit = (row) => {
        // Встановлюємо рядок для видалення та відкриваємо діалог
        console.log("row", row);
        setStorageEmployeeId(row.id);
        setActiveTab('addStorageEmployee');
    };
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
            toast.info('Співробітника успішно видалено!');
        }
    };
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        id: false, // Приховуємо колонку "ID"
    });
    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: "Ім'я", flex: 1, },
        { field: 'surname', headerName: 'Прізвище', flex: 1, },
        { field: 'email', headerName: 'Пошта', flex: 0.8, },
        { field: 'phoneNumber', headerName: 'Телефон', flex: 0.6, },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0,
            width: 75,
            cellClassName: 'text-center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: "5px", height: "100%" }}>
                    {(rolePermissions.canEditAnyEmployee() ||
                        rolePermissions.canEditSelf(params.row.id) ||
                        rolePermissions.canEditEmployeeAsAdmin(params.row.storageId, params.row.roleName))
                        &&
                        <Button
                            sx={{ minWidth: "10px", padding: 0 }}
                            color="primary"
                            title="Редагувати"
                            variant="outlined"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon />
                        </Button>
                    }
                    {(rolePermissions.canDeleteAnyEmployee() ||
                        rolePermissions.canDeleteEmployeeAsAdmin(params.row.storageId, params.row.roleName))
                        &&
                        <Button
                            sx={{ minWidth: "10px", padding: 0 }}
                            color="secondary"
                            title="Видалити"
                            variant="outlined"
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteIcon />
                        </Button>
                    }
                </Box>
            ),
        },
    ];

    return (

        <Box sx={{ width: '100%' }}>
            <ThemeProvider theme={themeFrame}>
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
                    {rolePermissions.IsFrameStorageEmployees_Button_AddStorageEmployee_Available && <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={() => { setStorageEmployeeId('0'); setActiveTab('addStorageEmployee') }}>
                        Додати
                    </Button>}
                </Box>
                <Box sx={{ overflowX: 'auto', maxWidth: process.env.NEXT_PUBLIC_ADMINPANEL_BOX_DATAGRID_MAXWIDTH }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
                    <DataGrid
                        rows={storageEmployees} // Використовуємо відфільтровані дані
                        columns={columns}
                        apiRef={apiRef}
                        loading={dataLoading}
                        columnVisibilityModel={columnVisibilityModel}
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
            </ThemeProvider>
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
                confirmButtonBackgroundColor='#00AAAD'
                cancelButtonBackgroundColor='#fff'
                cancelButtonBorderColor='#be0f0f'
                cancelButtonColor='#be0f0f'
                open={isDialogOpen}
            />
        </Box>
    )
}

export default StorageEmployees