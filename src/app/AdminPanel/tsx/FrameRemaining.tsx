import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares, Ware } from '@/pages/api/WareApi';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
//import FrameExpandableBlock from './FrameExpandableBlock';
import { useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import useAdminPanelStore from '@/store/adminPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../css/WarehouseFrame.css';
import FrameExpandableBlock from './FrameExpandableBlock';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00AAAD',
            contrastText: 'white',
        },
    },
});
export default function FrameRemaining() {
    const [loading, setLoading] = useState(true);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null); // ID складу
    const [selectedCategory, setSelectedCategory] = useState<WareCategory3 | null>(null); //по категории
    const [searchTerm, setSearchTerm] = useState('');
    const { frameRemainsSidebarVisibility, setFrameRemainsSidebarVisibility, setFrameRemainsSelectedWare } = useAdminPanelStore();
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [filteredData, setFilteredData] = useState<any | null>([]);
    const apiRef = useGridApiRef();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        discount: false,
    });

    // Загружаємо список складів
    const { data: storages = [] } = useStorages({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    const { data: wares = [], isLoading: dataLoading, isSuccess: success, refetch: refetchWares } = useWares({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Category3Id: selectedCategory?.id || null,
        QueryAny: debouncedSearchTerm.length > 0 ? debouncedSearchTerm : null,
    });

    // Загружаємо список категорій товарів
    const { data: wareCategories = [] } = useWareCategories3({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "WareCategory2NameThenCategory3NameAsc"
    });

    useEffect(() => {
        refetchWares();
    }, [debouncedSearchTerm, selectedCategory]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.3, maxWidth: 200 },
        {
            field: 'wareCategory2Name', headerName: 'Категорія', flex: 1, maxWidth: 200, renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px", height: "100%" }}>
                        <Typography variant="body2" sx={{ textWrap: "stable" }}>{params.value}</Typography>
                    </Box>
                );
            }
        },
        {
            field: 'description',
            headerName: 'Товар',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
                const imagePath = params.row.previewImagePath;

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px", height: "100%" }}>
                        {imagePath && (
                            <img
                                src={imagePath}
                                alt="preview"
                                style={{
                                    maxWidth: 40, objectFit: 'contain'
                                }}
                            />
                        )}
                        <Typography variant="body2" sx={{ textWrap: "stable" }}>{params.row.description}</Typography>
                    </Box>
                );
            },
        },
        {
            field: 'finalPrice',
            headerName: 'Ціна',
            flex: 0.3,
            maxWidth: 100,
            cellClassName: 'text-right',
            renderCell: (params) => {
                const price = params.value;
                return <Box>
                    {formatCurrency(price)}
                </Box>
            },
        },
        {
            field: 'totalWareItemsQuantity',
            headerName: 'Кількість',
            flex: 0.3,
            maxWidth: 100,
            cellClassName: 'text-right',
            renderCell: (params) => {
                const totalQuantity = selectedStorage ?
                    (params.row.wareItems.find(item => item.storageId === selectedStorage?.id)?.quantity || 0)
                    :
                    (params.value || 0);
                return (
                    <Box >
                        {totalQuantity}
                    </Box>
                );
            },
        },
        {
            field: 'totalWareItemsSum',
            headerName: 'Заг. сума товарів',
            flex: 0.3,
            maxWidth: 150,
            cellClassName: 'text-right',
            renderCell: (params) => {
                const totalSum = selectedStorage ?
                    (params.row.wareItems.find(item => item.storageId === selectedStorage?.id)?.totalSum || 0)
                    :
                    (params.value || 0);
                return (
                    <Box>
                        {formatCurrency(totalSum)}
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.3,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                    <Button
                        key={params.row.id}
                        sx={{
                            minWidth: '100px',
                            padding: '5px',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                            },
                        }}
                        title="Залишки"
                        variant="contained"
                        onClick={() => { setFrameRemainsSelectedWare(params.row); setFrameRemainsSidebarVisibility(true) }}
                    >
                        Залишки
                    </Button>
                </Box>
            ),
        }
    ];


    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '0';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    useEffect(() => {
        if (success && wares.length > 0) {
            setLoading(true);
            let updatedFilteredData;

            if (!selectedStorage) {
                // Якщо склад не вибрано, повертаємо всі товари
                updatedFilteredData = wares.map(ware => ({
                    ...ware,
                    totalWareItemsQuantity: ware.wareItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalWareItemsSum: ware.wareItems.reduce((sum, item) => sum + item.quantity * (ware.finalPrice || ware.price), 0),
                }));
            } else {
                // Якщо вибрано склад, фільтруємо товари за складом
                const filteredWares = wares.filter(ware =>
                    ware.wareItems.some(item => item.storageId === selectedStorage.id && item.quantity > 0)
                );

                updatedFilteredData = filteredWares.map(ware => {
                    const relevantItems = ware.wareItems.filter(item => item.storageId === selectedStorage.id);
                    const totalQuantity = relevantItems.reduce((sum, item) => sum + item.quantity, 0);
                    const totalSum = relevantItems.reduce(
                        (sum, item) => sum + item.quantity * (ware.finalPrice || ware.price),
                        0
                    );

                    return {
                        ...ware,
                        totalWareItemsQuantity: totalQuantity,
                        totalWareItemsSum: totalSum,
                    };
                });
            }

            setFilteredData(updatedFilteredData);
            setLoading(false);
        }
    }, [wares, success, selectedStorage]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: 2, display: frameRemainsSidebarVisibility ? "none" : "block" }}>
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
                        {/* Строка поиска*/}
                        <SearchField
                            searchTerm={searchTerm}
                            onSearchChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <Autocomplete
                            options={storages}
                            getOptionLabel={(option: Storage) =>
                                `${option.shopName}, 
                                ${option.street || 'Невідома вулиця'} ${option.houseNumber || ''}, 
                                ${option.city || 'Невідоме місто'}, 
                                ${option.postalCode || ''}`
                            }
                            value={selectedStorage || null}
                            onChange={(event, newValue) => setSelectedStorage(newValue)}
                            renderInput={(params) => <TextField {...params} label="Виберіть склад" variant="outlined" fullWidth />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                        <Autocomplete
                            options={wareCategories}
                            getOptionLabel={(option: WareCategory3) => `${option.wareCategory2Name} - ${option.name}`}
                            value={selectedCategory || null}
                            onChange={(event, newValue) => setSelectedCategory(newValue)}
                            renderInput={(params) => <TextField {...params} label="Виберіть категорію" variant="outlined" fullWidth />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />

                    </Box>
                </Box>
                <Box className="dataGridContainer" sx={{ flexGrow: 1 }} height="80vh" width="100%" overflow="auto">
                    {filteredData.length === 0 && !loading && success ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                            Нічого не знайдено
                        </Typography>
                    ) : (
                        <DataGrid
                            className="dataGrid"
                            rows={filteredData}
                            rowHeight={75}
                            columns={columns}
                            apiRef={apiRef}
                            loading={loading || dataLoading}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 100,
                                        page: 0,
                                    },
                                },
                                sorting: {
                                    sortModel: [
                                        {
                                            field: 'wareCategory2Name',
                                            sort: 'asc',
                                        },
                                    ],
                                },
                            }}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            disableRowSelectionOnClick
                            slots={{
                                toolbar: GridToolbar

                            }}
                            slotProps={{
                                toolbar: {
                                    csvOptions: {
                                        fileName: 'Товар',
                                        delimiter: ';',
                                        utf8WithBom: true,
                                    },
                                    printOptions: {
                                        hideFooter: true,
                                        hideToolbar: true,
                                    },
                                },
                            }}

                            columnVisibilityModel={columnVisibilityModel}
                            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                            localeText={{
                                MuiTablePagination: { labelRowsPerPage: 'Рядків на сторінці' },
                                columnsManagementReset: "Скинути",
                                columnsManagementSearchTitle: "Пошук",
                                toolbarExport: 'Експорт',
                                toolbarExportLabel: 'Експорт',
                                toolbarExportCSV: 'Завантажити як CSV',
                                toolbarExportPrint: 'Друк',
                                columnsManagementShowHideAllText: "Показати / Сховати всі",
                                filterPanelColumns: 'Стовпці',
                                filterPanelOperator: 'Оператор',
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
                            }}
                            sx={{
                                opacity: loading || dataLoading ? 0.5 : 1, // Напівпрозорість, якщо завантажується
                                flexGrow: 1, // Займає доступний простір у контейнері
                                minWidth: 800, // Мінімальна ширина DataGrid
                                "& .MuiDataGrid-scrollbar--horizontal": {
                                    position: 'fixed',
                                    bottom: "5px"
                                },
                                "& .MuiDataGrid-cell": {
                                    display: 'flex',
                                }
                            }}
                        />
                    )}
                </Box>
            </Box>
            {frameRemainsSidebarVisibility && <FrameExpandableBlock />}
        </ThemeProvider>
    );
}