import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, ThemeProvider, Typography } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef, GridColumnVisibilityModel, GridColDef } from '@mui/x-data-grid';
import { useOrders } from '@/pages/api/OrderApi';
import { useDebounce } from 'use-debounce';
import SearchField from './SearchField';
import themeFrame from './ThemeFrame';
import useAdminPanelStore from '@/store/adminPanel';
import { useQueryState } from 'nuqs';
import FrameOrderDetails from './FrameOrderDetails';

export default function FrameOrder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);

    const {
        data: orders = [],
        isFetching: dataLoading,
        isSuccess: success,
    } = useOrders({
        SearchParameter: 'Query',
        PageNumber: 1,
        PageSize: 1000,
    });

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
    const apiRef = useGridApiRef();
    const { setOrderDetailsSidebarVisibility, setSelectedOrder, orderDetailsSidebarVisibility } = useAdminPanelStore();
    const [activeTab] = useQueryState('at', { defaultValue: 'products', scroll: false, history: 'push', shallow: true });

    const statusColors = {
        'В обробці': { background: '#F5F5F5', text: '#616161' },
        'Підтверджено': { background: '#C8E6C9', text: '#1B5E20' },
        'Готується до відправки': { background: '#E3F2FD', text: '#0D47A1' },
        'Передано кур’єру': { background: '#F3E5F5', text: '#6A1B9A' },
        'Доставляється': { background: '#FFE0B2', text: '#E65100' },
        'Доставлено': { background: '#DCEDC8', text: '#388E3C' },
        'Скасовано': { background: '#FFEBEE', text: '#B71C1C' },
        'Готується до видачі': { background: '#FFCCBC', text: '#BF360C' },
        'Готове до видачі': { background: '#B2EBF2', text: '#00796B' },
        'Видано клієнту': { background: '#F5F5DC', text: '#3E2723' },
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            setOrderDetailsSidebarVisibility(false);
            setSelectedOrder(null);
        }
    }, [activeTab]);
    useEffect(() => {
        console.log(orders);
        if (success) {
            setFilteredData(orders);
            setLoading(false);
        }
        else {
            setLoading(true);
        }
    }, [orders, success]);
    useEffect(() => {
        setLoading(true);

        if (debouncedSearchTerm) {
            const filtered = orders.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(orders);
        }

        setLoading(false);
    }, [debouncedSearchTerm]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
        {
            field: 'orderDate',
            headerName: 'Дата замовлення',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => new Date(params.row.orderDate).toLocaleString('uk-UA'),
        },
        { field: 'phone', headerName: 'Телефон', flex: 0.5, minWidth: 150 },
        {
            field: 'shopName',
            headerName: 'Магазин',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => <span>{params.row.shop?.name}</span>,
        },
        {
            field: 'status',
            headerName: 'Статус',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const status = statusColors[params.row.status?.name] || { background: '#FFF', text: '#000' };
                return (
                    <span
                        style={{
                            backgroundColor: status.background,
                            color: status.text,
                            padding: '2px 10px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                        }}
                    >
                        {params.row.status?.name}
                    </span>
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            minWidth: 110,
            maxWidth: 110,
            width: 110,
            renderCell: (params) => (
                <Button
                    sx={{
                        minWidth: '100px',
                        padding: '3px',
                        '&:hover': { backgroundColor: '#005F60' },
                    }}
                    title="Деталі"
                    variant="contained"
                    onClick={() => {
                        setSelectedOrder(params.row);
                        setOrderDetailsSidebarVisibility(true);
                    }}
                >
                    Деталі
                </Button>
            ),
        },
    ];

    return (
        <Box>
            <ThemeProvider theme={themeFrame}>
                <Box sx={{ display: orderDetailsSidebarVisibility ? 'none' : 'block' }}>
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
                    <Box sx={{ overflowX: 'auto', maxWidth: process.env.NEXT_PUBLIC_ADMINPANEL_BOX_DATAGRID_MAXWIDTH }} height="80vh">
                        {filteredData.length === 0 && !loading ? (
                            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                                Нічого не знайдено
                            </Typography>
                        ) : (
                            <DataGrid
                                rows={filteredData}
                                columns={columns}
                                apiRef={apiRef}
                                loading={dataLoading || loading}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 100, page: 0 } },
                                    sorting: { sortModel: [{ field: 'orderDate', sort: 'desc' }] },
                                }}
                                sx={{
                                    opacity: loading || dataLoading ? 0.5 : 1, // Напівпрозорість, якщо завантажується
                                    flexGrow: 1, // Займає доступний простір у контейнері
                                    minWidth: 800, // Мінімальна ширина DataGrid
                                    // "& .MuiDataGrid-scrollbar--horizontal": {
                                    // 	position: 'fixed',
                                    // 	bottom: "5px"
                                    // },
                                    // "&. MuiDataGrid-topContainer": {
                                    //     backgroundColor: "#f3f3f3"
                                    // },
                                    // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '4px' },
                                    // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '11px' },
                                    // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '18px' },
                                }}
                                pageSizeOptions={[5, 10, 25, 50, 100]}
                                disableRowSelectionOnClick
                                slots={{ toolbar: GridToolbar }}
                                columnVisibilityModel={columnVisibilityModel}
                                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                            />
                        )}
                    </Box>
                </Box>
            </ThemeProvider>
            {orderDetailsSidebarVisibility && <FrameOrderDetails />}
        </Box>
    );
}
