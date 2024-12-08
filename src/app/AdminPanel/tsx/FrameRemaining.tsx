import { Storage, useStorages } from '@/pages/api/StorageApi';
import { useWares, Ware } from '@/pages/api/WareApi';
import { useWareItems } from '@/pages/api/WareItemApi';
import { Autocomplete, Box, Button, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
//import FrameExpandableBlock from './FrameExpandableBlock';
import { useWareCategories3, WareCategory3 } from '@/pages/api/WareCategory3Api';
import '../css/WarehouseFrame.css';

export default function FrameRemaining() {
    const [loading, setLoading] = useState(true);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null); // ID складу
    const [selectedCategory, setSelectedCategory] = useState<WareCategory3 | null>(null); //по категории
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWare, setSelectedWare] = useState<Ware | null>(null); // ID складу
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [filteredData, setFilteredData] = useState<any | null>([]);
    const [aggregatedWareItems, setAggregatedWareItems] = useState<any | null>([]);
    const apiRef = useGridApiRef();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        discount: false,
    });
    const [isVisible, setIsVisible] = useState(false); // Состояние для отображения компонента
    //const [showExpandableBlock, setShowExpandableBlock] = useState(false);

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
    // Завантаження складів для обраного продукту
    const { data: wareItems = [], refetch } = useWareItems(
        {
            SearchParameter: "Query",
            PageNumber: 1,
            PageSize: 100000,
            WareCategory3Id: selectedCategory?.id || null,
            StorageId: selectedStorage?.id || null,
            //QueryAny: debouncedSearchTerm.length > 0 ? debouncedSearchTerm : null,
        },
        true  // Запит активний лише якщо обрано склад і товар
    );

    useEffect(() => {
        refetchWares();
        refetch();
    }, [selectedCategory, selectedStorage]);


    useEffect(() => {
        // Оновлюємо доступну кількість
        if (wareItems.length > 0) {
            console.log("WareItems:", wareItems);
            console.log("aggregateWareItems:", aggregateWareItems(wareItems));
            setAggregatedWareItems(aggregateWareItems(wareItems));
        }
    }, [wareItems]);


    //поиск по строке поиска и по категории
    useEffect(() => {
        refetchWares();
    }, [debouncedSearchTerm, selectedCategory]);

    // const handleClick = () => {
    //     setShowExpandableBlock((prev) => !prev); // Переключаем состояние
    // };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.3, maxWidth: 200 },
        { field: 'wareCategory2Name', headerName: 'Категорія', flex: 1, maxWidth: 200 },
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
                        <Typography variant="body2">{params.row.description}</Typography>
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
                const totalQuantity = aggregatedWareItems.find(item => item.wareId === params.row.id)?.totalQuantity || 0;
                return (
                    <Box >
                        {/* {!selectedCategory && !selectedStorage && params.row.totalWareItemsQuantity}
                        {(selectedCategory || selectedStorage) && Number(totalQuantity)} */}
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
                // Форматуємо результат (наприклад, додаємо валюту)
                // Отримуємо значення totalQuantity і price
                const totalQuantity = aggregatedWareItems.find(item => item.wareId === params.row.id)?.totalQuantity || 0;
                const price = params.row.finalPrice || 0;

                // Обчислюємо загальну суму
                const totalSum = totalQuantity * price;
                return (
                    <Box>
                        {/* {formatCurrency(params.row.totalWareItemsSum)} */}
                        {formatCurrency(totalSum)}


                    </Box>
                );
            },
        },
        {
            field: 'button',
            headerName: '',
            flex: 0.3,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                    <Button
                        sx={{
                            minWidth: '100px',
                            padding: '5px',
                            backgroundColor: 'blue',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                            },
                        }}
                        title="Залишки"
                        variant="outlined"
                        onClick={() => setIsVisible(!isVisible)}
                    >
                        Залишки
                    </Button>

                    {/* Блок с таблицей */}
                    <Box
                        sx={{
                            width: '100%',
                            mt: 1, // Отступ между кнопкой и блоком
                            overflow: 'hidden',
                            maxHeight: isVisible ? '500px' : '0', // Анимация роста высоты
                            transition: 'max-height 0.5s ease-out', // Плавное изменение высоты
                        }}
                    >
                        {isVisible && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Склад</TableCell>
                                            <TableCell align="right">Залишки</TableCell>
                                            <TableCell align="right">Загальна сума</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {/* <TableBody>
                                        {filteredStorages.map((storage) => (
                                            <TableRow key={storage.id}>
                                                <TableCell>{storage.name}</TableCell>
                                                <TableCell align="right">{storage.quantity}</TableCell>
                                                <TableCell align="right">{storage.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody> */}
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </Box>
            ),
        }
    ];

    // Функція для форматування значення
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '0';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    //Функція для підрахунку загальної кількості по wareId
    const aggregateWareItems = (items) => {
        const aggregated = {};
        items.forEach((item) => {
            if (!aggregated[item.wareId]) {
                aggregated[item.wareId] = { wareId: item.wareId, totalQuantity: 0 };
            }
            aggregated[item.wareId].totalQuantity += item.quantity;
        });
        // Повертаємо масив для гріда
        return Object.values(aggregated);
    };
    // const aggregateWareItems = (items) => {
    //     return items.reduce((acc, item) => {
    //         acc[item.wareId] = acc[item.wareId] || { wareId: item.wareId, totalQuantity: 0 };
    //         acc[item.wareId].totalQuantity += item.quantity;
    //         return acc;
    //     }, {});
    // };


    useEffect(() => {
        if (success && wares.length > 0) {
            setFilteredData(wares);
            setLoading(false);
        }
    }, [wares, success]);

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
                            }
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
