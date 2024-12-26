import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares } from '@/pages/api/WareApi';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
import { useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import useAdminPanelStore from '@/store/adminPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../css/WarehouseFrame.css';
import FrameExpandableBlock from './FrameExpandableBlock';
import themeFrame from './ThemeFrame';

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

    // Загружаємо список товарів
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
        {
            field: 'id', headerName: 'ID',
            minWidth: 110,
            width: 110,
            maxWidth: 110,
        },
        {
            field: 'wareCategory2Name', headerName: 'Категорія', minWidth: 150,
            width: 150,
            maxWidth: 200, renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px", height: "100%" }}>
                        <Typography variant="body2"
                            sx={{
                                wordWrap: 'break-word', // Перенос длинных слов
                                whiteSpace: 'normal',
                                overflow: 'visible',
                            }}>
                            {params.value}
                        </Typography>
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
                        <Typography variant="body2"
                            sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                overflow: 'visible',
                            }}>
                            {params.row.description}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: 'finalPrice',
            headerName: 'Ціна',
            headerAlign: 'right',
            flex: 0.3,
            maxWidth: 150,
            renderCell: (params) => {
                const price = params.value;
                return <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', textWrap: "nowrap" }}>
                    {formatCurrency(price)}
                </Box>
            },
        },
        {
            field: 'totalWareItemsQuantity',
            headerName: 'Кількість',
            headerAlign: 'center',
            hideSortIcons: true,
            flex: 0.3,
            //maxWidth: 150,
            renderCell: (params) => {
                const totalQuantity = selectedStorage ?
                    (params.row.wareItems.find(item => item.storageId === selectedStorage?.id)?.quantity || 0)
                    :
                    (params.value || 0);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        {totalQuantity}
                    </Box>
                );
            },
        },
        {
            field: 'totalWareItemsSum',
            headerName: 'Загальна вартість товарів',
            hideSortIcons: true,
            headerAlign: 'right',
            flex: 0.3,
            maxWidth: 200,
            renderCell: (params) => {
                const totalSum = selectedStorage ?
                    (params.row.wareItems.find(item => item.storageId === selectedStorage?.id)?.totalSum || 0)
                    :
                    (params.value || 0);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', textWrap: "nowrap" }}>
                        {formatCurrency(totalSum)}
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            width: 110,
            maxWidth: 110,
            minWidth: 110,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Button
                        key={params.row.id}
                        sx={{
                            minWidth: '100px',
                            padding: '3px',
                            '&:hover': {
                                backgroundColor: '#005F60',
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
        <ThemeProvider theme={themeFrame}>
            <Box sx={{ display: frameRemainsSidebarVisibility ? "none" : "block" }}>
                <Typography sx={{ mb: 2 }} variant="h5" gutterBottom>
                    Залишки
                </Typography>
                <Box>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        alignItems: 'center',
                        gap: 3,
                        mb: 3,
                    }}>
                        {/* Строка поиска*/}
                        <SearchField
                            searchTerm={searchTerm}
                            onSearchChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <Autocomplete
                            options={storages}
                            getOptionLabel={(option: Storage) =>
                                `${option.shopName}, ${option.street || 'Невідома вулиця'} ${option.houseNumber || ''}, ${option.city || 'Невідоме місто'}, ${option.postalCode || ''}`
                            }
                            value={selectedStorage || null}
                            onChange={(event, newValue) => setSelectedStorage(newValue)}
                            renderInput={(params) => <TextField {...params} label="Виберіть склад" variant="outlined" fullWidth
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '42px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        height: '1.2rem !important',
                                        top: '-4px !important',
                                    }
                                }}
                            />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                        <Autocomplete
                            options={wareCategories}
                            getOptionLabel={(option: WareCategory3) => `${option.wareCategory2Name} - ${option.name}`}
                            value={selectedCategory || null}
                            onChange={(event, newValue) => setSelectedCategory(newValue)}
                            renderInput={(params) => <TextField {...params} label="Виберіть категорію" variant="outlined" fullWidth
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '42px', // Уменьшаем высоту самого поля
                                    },
                                    '& .MuiInputLabel-root': {
                                        height: '1.2rem',
                                        top: '-4px',
                                    }
                                }}
                            />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                    </Box>
                </Box>
                <Box sx={{ overflowX: 'auto', maxWidth: process.env.NEXT_PUBLIC_ADMINPANEL_BOX_DATAGRID_MAXWIDTH }} height="80vh">
                    {filteredData.length === 0 && !loading && success ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                            Нічого не знайдено
                        </Typography>
                    ) : (
                        <DataGrid
                            className="dataGrid"
                            rows={filteredData}
                            getRowHeight={() => 'auto'} // Динамічна висота рядка
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
                                // "& .MuiDataGrid-scrollbar--horizontal": {
                                //     position: 'fixed',
                                //     bottom: "5px"
                                // },
                                "& .MuiDataGrid-cell": {
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                "&. MuiDataGrid-topContainer": {
                                    backgroundColor: "#f3f3f3"
                                },
                                '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '4px' },
                                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '11px' },
                                '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '18px' },
                            }}
                        />
                    )}
                </Box>
            </Box>
            {frameRemainsSidebarVisibility && <FrameExpandableBlock />}
        </ThemeProvider>
    );
}