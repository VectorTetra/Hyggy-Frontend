import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useOrderStatuses } from '@/pages/api/OrderStatusApi';
import useAdminPanelStore from '@/store/adminPanel';
import themeFrame from './ThemeFrame';
import { useUpdateOrder } from '@/pages/api/OrderApi';

export default function FrameOrderDetails() {
    const { selectedOrder, setOrderDetailsSidebarVisibility } = useAdminPanelStore();
    const { data: statuses = [] } = useOrderStatuses({
        SearchParameter: "Query",
        QueryAny: selectedOrder.deliveryTypeId === 1 ? "Самовивіз" : "Доставка",
    }, selectedOrder !== null && selectedOrder.deliveryTypeId !== null);
    const { mutateAsync: updateOrder } = useUpdateOrder();

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedOrder) {
            setStatus(statuses.find(s => s.id === selectedOrder.statusId) || null);
        }
    }, [selectedOrder, statuses]);

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await updateOrder({
                Id: selectedOrder.id,
                StatusId: newStatus.id,
                ShopId: selectedOrder.shopId,
                CustomerId: selectedOrder.customerId,
                Comment: selectedOrder.comment,
                OrderDate: selectedOrder.orderDate,
                Phone: selectedOrder.phone,
                DeliveryAddressId: selectedOrder.deliveryAddressId,
                DeliveryTypeId: selectedOrder.deliveryTypeId,
                OrderItemIds: selectedOrder.orderItemIds,
            });
            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '0';
        const roundedValue = Math.round(value * 100) / 100;
        return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
    };

    return (
        <ThemeProvider theme={themeFrame}>
            <Box sx={{ zIndex: 1000, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ textWrap: "wrap" }} variant="h6" gutterBottom>
                        Деталі замовлення
                    </Typography>
                    <Button sx={{
                        fontWeight: 'bold', fontSize: '22px',
                        '&:hover': {
                            color: '#005F60',
                        },
                    }} onClick={() => setOrderDetailsSidebarVisibility(false)}> X </Button>
                </Box>
                <TableContainer component={Paper} sx={{ width: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ fontWeight: 1000 }}>
                                <TableCell><Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>№ замовлення: {selectedOrder?.id}</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Замовник</TableCell>
                                <TableCell align="right">{selectedOrder?.customer?.name} {selectedOrder?.customer?.surname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Дата замовлення</TableCell>
                                <TableCell align="right">{new Date(selectedOrder?.orderDate.toString()).toLocaleString('uk-UA')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Номер телефону</TableCell>
                                <TableCell align="right">{selectedOrder?.phone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Пошта</TableCell>
                                <TableCell align="right">{selectedOrder?.customer?.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Статус замовлення</TableCell>
                                <TableCell align="right">
                                    <Autocomplete
                                        options={statuses}
                                        getOptionLabel={(option: { id: number, name: string }) => option ? option.name : ''}
                                        value={status}
                                        onChange={(event, newValue) => handleStatusChange(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Статус замовлення" variant="outlined" />}
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    />
                                    {loading && <CircularProgress size={24} />}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Адреса доставки</TableCell>
                                <TableCell align="right">{selectedOrder?.deliveryAddress?.street} {selectedOrder?.deliveryAddress?.houseNumber}, {selectedOrder?.deliveryAddress?.city}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Коментар</TableCell>
                                <TableCell align="right">{selectedOrder?.comment || 'Немає коментарів'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Назва магазину</TableCell>
                                <TableCell align="right">{selectedOrder?.shop?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Загальна сума</TableCell>
                                <TableCell align="right">{formatCurrency(selectedOrder?.totalPrice)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Товари в замовленні
                </Typography>
                <TableContainer component={Paper} sx={{ width: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Товар</TableCell>
                                <TableCell>Кількість</TableCell>
                                <TableCell>Ціна</TableCell>
                                <TableCell>Зображення</TableCell>
                                <TableCell>Загальна сума</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOrder?.orderItems?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.ware.description}</TableCell>
                                    <TableCell>{item.count}</TableCell>
                                    <TableCell sx={{ textAlign: "right", textWrap: "nowrap" }}>{formatCurrency(item.priceHistory.price)}</TableCell>
                                    <TableCell>
                                        <img src={item.ware.previewImagePath} alt="preview" style={{ maxHeight: 40, width: 40, objectFit: 'contain' }} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right", textWrap: "nowrap" }}>{formatCurrency(item.count * item.priceHistory.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}
