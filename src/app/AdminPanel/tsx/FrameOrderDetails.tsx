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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "baseline" }}>
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
                                <TableCell colSpan={2} sx={{ textAlign: "left" }}><Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>№ замовлення: {selectedOrder?.id}</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "30%" }}>Замовник</TableCell>
                                <TableCell align="left">{selectedOrder?.customer?.name} {selectedOrder?.customer?.surname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Дата замовлення</TableCell>
                                <TableCell align="left">{new Date(selectedOrder?.orderDate.toString()).toLocaleString('uk-UA')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Номер телефону</TableCell>
                                <TableCell align="left">{selectedOrder?.phone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Пошта</TableCell>
                                <TableCell align="left">{selectedOrder?.customer?.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Статус замовлення</TableCell>
                                <TableCell align="left">
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
                                <TableCell sx={{ fontWeight: 700 }}>Адреса доставки</TableCell>
                                <TableCell align="left" >{selectedOrder?.deliveryAddress?.street} {selectedOrder?.deliveryAddress?.houseNumber}, {selectedOrder?.deliveryAddress?.city}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Спосіб доставки</TableCell>
                                <TableCell align="left" >{selectedOrder?.deliveryType?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Коментар</TableCell>
                                <TableCell align="left">{selectedOrder?.comment || 'Немає коментарів'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Назва магазину</TableCell>
                                <TableCell align="left">{selectedOrder?.shop?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Загальна сума</TableCell>
                                <TableCell align="left">{formatCurrency(selectedOrder?.totalPrice)}</TableCell>
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
                                <TableCell sx={{ textAlign: "left", textWrap: "nowrap" }}>ID</TableCell>
                                <TableCell sx={{ textAlign: "left", textWrap: "nowrap" }}>Товар</TableCell>
                                <TableCell sx={{ textAlign: "center", textWrap: "nowrap" }}>Кількість</TableCell>
                                <TableCell sx={{ textAlign: "right", width: "10ch" }}>Ціна</TableCell>
                                <TableCell sx={{ textAlign: "center", textWrap: "nowrap" }}>Зображення</TableCell>
                                <TableCell sx={{ textAlign: "right", textWrap: "nowrap" }}>Загальна сума</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOrder?.orderItems?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ textAlign: "left", textWrap: "nowrap" }}>{item.id}</TableCell>
                                    <TableCell sx={{ textAlign: "left", textWrap: "nowrap" }}>{item.ware.description}</TableCell>
                                    <TableCell sx={{ textAlign: "center", textWrap: "nowrap" }}>{item.count}</TableCell>
                                    <TableCell sx={{ textAlign: "right", textWrap: "nowrap" }}>{formatCurrency(item.priceHistory.price)}</TableCell>
                                    <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                                        <img src={item.ware.previewImagePath} alt="preview" style={{ height: 40, width: 40, objectFit: 'contain' }} />
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
