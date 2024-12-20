import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel, GridColDef } from '@mui/x-data-grid';
import { useOrders } from '@/pages/api/OrderApi';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
import themeFrame from './ThemeFrame';
import useAdminPanelStore from '@/store/adminPanel';
import FrameOrderDetails from './FrameOrderDetails';
import { useQueryState } from 'nuqs';


export default function FrameOrder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const { data: data = [], isFetching: dataLoading, isSuccess: success } = useOrders({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000
    });
    console.log(data);
    const [filteredData, setFilteredData] = useState<any | null>([]);
    const [loading, setLoading] = useState(true);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    const apiRef = useGridApiRef();
    const { setOrderDetailsSidebarVisibility, setSelectedOrder, orderDetailsSidebarVisibility } = useAdminPanelStore();
	const [activeTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });

    const statusColors = {
        "В обробці": { background: "#F5F5F5", text: "#616161" }, // Очень светлый серый фон, темно-серый текст
        "Підтверджено": { background: "#C8E6C9", text: "#1B5E20" }, // Очень светлый салатовый фон, тёмно-зеленый текст
        "Готується до відправки": { background: "#E3F2FD", text: "#0D47A1" }, // Очень светлый синий фон, темно-синий текст
        "Передано кур'єру": { background: "#F3E5F5", text: "#6A1B9A" }, // Очень светлый фиолетовый фон, темно-фиолетовый текст
        "Доставляється": { background: "#FFE0B2", text: "#E65100" }, // Очень светлый оранжевый фон, тёмно-оранжевый текст 
        "Доставлено": { background: "#DCEDC8", text: "#388E3C" }, // Очень светлый зеленый фон, темно-зеленый текст
        "Скасовано": { background: "#FFEBEE", text: "#B71C1C" }, // Очень светлый красный фон, темно-красный текст
        "Готується до видачі": { background: "#FFCCBC", text: "#BF360C" }, // Очень светлый красно-оранжевый фон, тёмно-красный текст
        "Готове до видачі": { background: "#B2EBF2", text: "#00796B" }, // Очень светлый бирюзовый фон, темно-бирюзовый текст
        "Видано клієнту": { background: "#F5F5DC", text: "#3E2723" }, // Очень светлый бежевый фон, темно-коричневый текст
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            setOrderDetailsSidebarVisibility(false);
            setSelectedOrder(null);
        }
    }, [activeTab, setOrderDetailsSidebarVisibility, setSelectedOrder]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        {
            field: 'orderDate', headerName: 'Дата замовлення', flex: 0.5, minWidth: 150,
            renderCell: (params) => (
                new Date(params.row.orderDate).toLocaleString('uk-UA')
            ),
        },
        { field: 'phone', headerName: 'Телефон', flex: 0.5, minWidth: 150 },
        {
            field: 'shopName', headerName: 'Магазин', flex: 0.5, minWidth: 150,
            renderCell: (params) => (
                <span>{params.row.shop.name}</span>
            ),
        },
        {
            field: 'status', headerName: 'Статус', flex: 0.5, minWidth: 150,
            sortable: true,
            renderCell: (params) => {
                const statusName = params.row.status.name;
                const status = statusColors[statusName] || { background: '#FFFFFF', text: '#000000' }; // Если статус не найден, используем дефолтные цвета
                return (
                    <span
                        style={{
                            backgroundColor: status.background, // Цвет фона
                            color: status.text, // Цвет текста в зависимости от статуса
                            padding: '2px 10px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                        }}
                    >
                        {statusName}
                    </span>
                );
            },
            sortComparator: (v1, v2) => {
                return v1.name.localeCompare(v2.name);
            },
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.3,
            renderCell: (params) => (
                <Box>
                    <Button
                        key={params.row.id}
                        sx={{
                            minWidth: '100px',
                            padding: '3px',
                            '&:hover': {
                                backgroundColor: '#005F60',
                            },
                        }}
                        title="Деталі"
                        variant="contained"
                        onClick={() => { setSelectedOrder(params.row); setOrderDetailsSidebarVisibility(true); }}
                    >
                        Деталі
                    </Button>
                </Box>
            ),
        },
    ];

    useEffect(() => {
        const fetchFilteredData = () => {
            setLoading(true);
            try {
                const searchInObject = (obj, searchTerm) => {
                    for (const key in obj) {
                        const value = obj[key];
                        if (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return true;
                        } else if (typeof value === 'number' && value.toString().includes(searchTerm)) {
                            return true;
                        } else if (value && typeof value === 'object') {
                            if (searchInObject(value, searchTerm)) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                if (debouncedSearchTerm) {
                    const filteredOrders = data.filter(item => searchInObject(item, debouncedSearchTerm));
                    setFilteredData(filteredOrders);
                } else {
                    setFilteredData(data);
                }
            } catch (error) {
                console.error('Error filtering data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [debouncedSearchTerm, data]);


    return (
        <Box>
            <ThemeProvider theme={themeFrame}>
                <Box sx={{ display: orderDetailsSidebarVisibility ? "none" : "block" }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'normal',
                        marginBottom: '1rem',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        width: "100%",
                        padding: '0'
                    }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            Замовлення : {dataLoading || loading ? <CircularProgress size={24} /> : filteredData.length}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <SearchField
                                searchTerm={searchTerm}
                                onSearchChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box className="dataGridContainer" sx={{ flexGrow: 1 }} height="80vh" width="100%" overflow="auto">
                        {filteredData.length === 0 && !loading ? (
                            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                                Нічого не знайдено
                            </Typography>
                        ) : (
                            <DataGrid
                                className="dataGrid"
                                rows={filteredData}
                                columns={columns}
                                apiRef={apiRef}
                                loading={dataLoading || loading}
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
                                                field: 'orderDate',
                                                sort: 'desc',
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
                                            fileName: 'Замовлення',
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
                                    opacity: loading ? 0.5 : 1,
                                    flexGrow: 1,
                                    minWidth: 800,
                                    "& .MuiDataGrid-scrollbar--horizontal": {
                                        position: 'fixed',
                                        bottom: "5px"
                                    }
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </ThemeProvider>
            {orderDetailsSidebarVisibility && <FrameOrderDetails />}
        </Box>
    );
}
