import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { getWares, deleteWare } from '@/pages/api/WareApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { toast } from 'react-toastify';
import useAdminPanelStore from '@/store/adminPanel';
import { useQueryState } from 'nuqs';

export default function WareFrame() {
    const [data, setData] = useState<any | null>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        price: false,
        discount: false,
    });
    const [searchTerm, setSearchTerm] = useState(''); // Стан для швидкого пошуку
    const apiRef = useGridApiRef();
    const { wareId, setWareId } = useAdminPanelStore();
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });


    // Фільтрація даних на основі швидкого пошуку
    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        { field: 'name', headerName: 'Виробник', flex: 0.5, minWidth: 100 },
        { field: 'description', headerName: 'Товар', flex: 1, minWidth: 200 },
        { field: 'price', headerName: 'Початкова ціна', flex: 0.3, minWidth: 150 },
        { field: 'discount', headerName: 'Знижка', flex: 0.3, minWidth: 100 },
        { field: 'finalPrice', headerName: 'Ціна', flex: 0.3, minWidth: 150 },
        { field: 'averageRating', headerName: 'Рейтинг', flex: 0.3, minWidth: 50 },
        { field: 'isDeliveryAvailable', headerName: 'Доставка', flex: 0.3, width: 50 },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0,
            width: 75,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
                    <Button sx={{ minWidth: "10px", padding: 0 }} title='Редагувати' variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </Button>
                    <Button sx={{ minWidth: "10px", padding: 0 }} title='Видалити' variant="outlined" color="secondary" onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

    const fetchWares = async () => {
        try {
            setLoading(true);
            const wares = await getWares({ SearchParameter: "Query", PageNumber: 1, PageSize: 10 });
            setData(wares);
        } catch (error) {
            console.error('Error fetching wares:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (row) => {
        setWareId(row.id);
        console.log("row.id :", row.id)
        setActiveTab("addEditWare"); // Змінюємо активну вкладку
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedRow) {
            await deleteWare(selectedRow.id);
            setIsDialogOpen(false);
            setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
            toast.info('Товар успішно видалено!');
        }
    };


    useEffect(() => {
        fetchWares();
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Товари</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    label="Швидкий пошук"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан для швидкого пошуку
                />
                <Button variant="contained" onClick={() => { setWareId(0); setActiveTab("addEditWare"); }}>Додати</Button>
            </Box>
            <Box sx={{ overflowX: 'auto' }} height="80vh"> {/* Додаємо прокрутку при переповненні */}
                <DataGrid
                    rows={filteredData} // Використовуємо відфільтровані дані
                    columns={columns}
                    apiRef={apiRef}
                    loading={loading}
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                fileName: 'Товари',
                                delimiter: ';',
                                utf8WithBom: true,
                            },
                            printOptions: {
                                hideFooter: true,
                                hideToolbar: true,
                            },
                        },
                    }}
                    columnVisibilityModel={columnVisibilityModel} // Додаємо модель видимості колонок
                    onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)} // Оновлюємо стан видимості колонок
                    localeText={{
                        MuiTablePagination: { labelRowsPerPage: 'Рядків на сторінці' },
                        columnsManagementReset: "Скинути",
                        columnsManagementSearchTitle: "Пошук",
                        toolbarExport: 'Експорт',
                        toolbarExportLabel: 'Експорт',
                        toolbarExportCSV: 'Завантажити як CSV',
                        toolbarExportPrint: 'Друк',
                        columnsManagementShowHideAllText: "Показати / Сховати всі",
                        filterPanelColumns: 'Стовпці', // Переклад для "Columns"
                        filterPanelOperator: 'Оператор', // Переклад для "Operator"
                        // filterPanelValue: 'Значення', 
                        // filterPanelFilterValue: 'Значення фільтра',
                        toolbarExportExcel: "Експорт",
                        filterPanelInputLabel: "Значення",
                        filterPanelInputPlaceholder: 'Значення фільтра',
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
                        toolbarColumnsLabel: 'Оберіть стовпці',
                        toolbarFilters: 'Фільтри',
                        toolbarFiltersLabel: 'Показати фільтри',
                        toolbarFiltersTooltipHide: 'Приховати фільтри',
                        toolbarFiltersTooltipShow: 'Показати фільтри',
                        toolbarQuickFilterPlaceholder: 'Пошук...',
                        toolbarQuickFilterLabel: 'Пошук',
                        toolbarQuickFilterDeleteIconLabel: 'Очистити',
                    }
                    }
                />
            </Box>
            <ConfirmationDialog
                title="Видалити товар?"
                contentText={selectedRow ? `Ви справді хочете видалити товар "${selectedRow.name}"?` : ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDialogOpen(false)}
                open={isDialogOpen}
            />
        </Box>
    );
}
