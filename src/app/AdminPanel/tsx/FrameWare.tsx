import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel, GridColDef } from '@mui/x-data-grid';
import { useDeleteWare, useWares } from '@/pages/api/WareApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '@/app/sharedComponents/ConfirmationDialog';
import { toast } from 'react-toastify';
import { useQueryState } from 'nuqs';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
import StarRating from '@/app/sharedComponents/StarRating';
import useAdminPanelStore from '@/store/adminPanel';
import themeFrame from './ThemeFrame';
import { formatCurrency } from "@/app/sharedComponents/methods/formatCurrency";


export default function WareFrame({ rolePermissions }) {
    const { mutate: deleteWare } = useDeleteWare();
    //const [activeNewWare, setActiveNewWare] = useQueryState("new-edit", { clearOnDefault: true, scroll: false, history: "push", shallow: true });
    const { data: data = [], isLoading: dataLoading, isSuccess: success } = useWares({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000
    });
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
    const { wareId, setWareId } = useAdminPanelStore();

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', minWidth: 70,
            width: 70,
            maxWidth: 70,
            renderCell: (params) => {
                return <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    {params.value}
                </Box>;
            }
        },
        {
            field: 'name',
            headerName: 'Виробник',
            headerAlign: 'left',
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => {
                return <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    {params.value}
                </Box>;
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
                                wordWrap: 'break-word', // Перенос длинных слов
                                whiteSpace: 'normal',
                                textWrap: 'wrap',
                                overflow: 'visible',
                            }}>
                            {params.row.description}</Typography>
                    </Box>
                );
            },
        },
        {
            field: 'price',
            headerName: 'Початкова ціна',
            headerAlign: 'right',
            flex: 0.3,
            minWidth: 150,
            renderCell: (params) => {
                const price = params.value;
                return <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    {formatCurrency(price, "₴")}
                </Box>;
            },
        },
        {
            field: 'discount',
            headerName: 'Знижка',
            headerAlign: 'right',
            flex: 0.3,
            minWidth: 100,
            renderCell: (params) => {
                const discount = params.value;
                return <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    {discount} %
                </Box>
            },
        },
        {
            field: 'finalPrice',
            headerName: 'Кінцева ціна',
            flex: 0.3,
            minWidth: 150,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => {
                const finalPrice = params.value;
                return <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    {formatCurrency(finalPrice, "₴")}
                </Box>;
            },
        },
        {
            field: 'averageRating',
            headerName: 'Рейтинг',
            minWidth: 150,
            width: 150,
            maxWidth: 150,
            headerAlign: 'center',
            renderCell: (params) => {
                const rating = params.value;
                return <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <StarRating rating={Number(rating)} />
                </Box>;
            },
        },
        {
            field: 'isDeliveryAvailable', type: 'boolean', headerName: 'Доставка',
            minWidth: 150,
            width: 150,
            maxWidth: 150,
        }
    ];
    if (rolePermissions.IsFrameWare_Button_EditWare_Available || rolePermissions.IsFrameWare_Button_DeleteWare_Available) {
        columns.push({
            field: 'actions',
            headerName: '',
            flex: 0,
            minWidth: 75,
            maxWidth: 75,
            width: 75,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "5px", height: "100%" }}>
                    {rolePermissions.IsFrameWare_Button_EditWare_Available && (
                        <Button
                            sx={{ minWidth: "10px", padding: 0, color: "#00AAAD" }}
                            title='Редагувати'
                            variant="outlined"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon />
                        </Button>
                    )}
                    {rolePermissions.IsFrameWare_Button_DeleteWare_Available && (
                        <Button
                            sx={{ minWidth: "10px", padding: 0, color: '#be0f0f', borderColor: '#be0f0f' }}
                            title='Видалити'
                            variant="outlined"
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteIcon />
                        </Button>
                    )}
                </Box>
            ),
        });
    }

    const handleEdit = (row) => {
        setWareId(row.id);
        console.log("row.id :", row.id)
        setActiveTab("addEditWare"); // Змінюємо активну вкладку
    };

    const handleDelete = (row) => {
        // Встановлюємо рядок для видалення та відкриваємо діалог
        console.log("row", row);
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRow) {
            console.log("selectedRow", selectedRow);
            deleteWare(selectedRow.id, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.info('Товар успішно видалено!');
                    // Якщо потрібно оновити локальний стан:
                    // setData((prevData) => prevData.filter((item) => item.id !== selectedRow.id));
                }
            });
        }
    };

    useEffect(() => {
        // if (data.length === 0)
        // 	queryClient.invalidateQueries('storages');
        console.log(data);
        if (success) {
            setFilteredData(data);
            setLoading(false);
            setWareId(null);
        }
        else {
            setLoading(true);
        }
    }, [data, success]);


    useEffect(() => {
        const fetchFilteredData = () => {
            setLoading(true);
            try {
                //if (data.length === 0) { toast.error('data не ініціалізована!'); return; }
                if (debouncedSearchTerm) {
                    // Фільтруємо дані локально по будь-якому полю
                    const filteredStorages = data.filter(item =>
                        Object.values(item).some(value =>
                            // Перевіряємо, чи є значення строкою та чи містить воно термін пошуку
                            typeof value === 'string' && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                        )
                    );
                    setFilteredData(filteredStorages); // Оновлюємо відфільтровані дані
                    //toast.info('Встановлено filteredStorages!');
                } else {
                    setFilteredData(data); // Якщо немає терміна пошуку, використовуємо всі дані
                    console.log(data);
                    //toast.info('Встановлено data!');
                }
            } catch (error) {
                console.error('Error filtering data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [debouncedSearchTerm]);

    return (
        <Box>
            <ThemeProvider theme={themeFrame}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'normal',
                    marginBottom: '1rem',
                    position: 'sticky', // Фіксована позиція
                    top: 0, // Залишається зверху
                    left: 0,
                    zIndex: 1, // Вищий z-index, щоб бути поверх DataGrid
                    width: "100%",
                    padding: '0' // Додаємо відступи для панелі
                }}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>
                        Товари : {loading ? <CircularProgress size={24} /> : filteredData.length}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: rolePermissions.IsFrameWare_Button_AddWare_Available ? 'space-between' : 'flex-start',
                    }}>
                        <SearchField
                            searchTerm={searchTerm}
                            onSearchChange={(event) => setSearchTerm(event.target.value)}
                        />
                        {rolePermissions.IsFrameWare_Button_AddWare_Available && <Button variant="contained" sx={{ backgroundColor: "#00AAAD" }} onClick={() => {
                            setWareId(0);
                            setActiveTab("addEditWare");
                        }}>
                            Додати
                        </Button>}
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
                            columns={columns}
                            apiRef={apiRef}
                            loading={loading || dataLoading}
                            getRowHeight={() => 'auto'} // Динамічна висота рядка
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
                                            field: 'shopName',
                                            sort: 'asc', // 'asc' для зростання або 'desc' для спадання
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
                            }}
                            sx={{
                                opacity: loading || dataLoading ? 0.5 : 1, // Напівпрозорість, якщо завантажується
                                flexGrow: 1, // Займає доступний простір у контейнері
                                minWidth: 800, // Мінімальна ширина DataGrid
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
            </ThemeProvider>
            <ConfirmationDialog
                title="Видалити товар?"
                contentText={
                    selectedRow
                        ? (
                            <>
                                {`Назва товару: ${selectedRow.description && `${selectedRow.description}`}`}
                                <br />
                                {`Кінцева ціна: ${selectedRow.finalPrice && `${selectedRow.finalPrice}`}`}
                            </>
                        )
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
    );

}