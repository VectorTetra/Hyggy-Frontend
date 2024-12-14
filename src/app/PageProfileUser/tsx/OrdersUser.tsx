import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import data from '../PageProfileUser.json';
import ReviewDialog from '@/app/sharedComponents/ReviewDialog';
import { WareGetDTO } from "@/pages/api/WareApi";

export default function OrdersUser() {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<WareGetDTO | null>(null);

    const handleToggle = (orderId) => {
        setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
    };

    const handleOpenReviewModal = (orderId, product) => {
        setSelectedProduct({ orderId, ...product });
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedProduct(null);
    };

    //Проверка на наличие заказов
    const hasOrders = data.orders && data.orders.length > 0;

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9', margin: '20px 0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <Typography variant="h4" gutterBottom>
                    Мої замовлення
                </Typography>
            </Box>

            {!hasOrders ? ( // Проверка на наличие заказов
                <Typography variant="body1" color="text.secondary" align="center">
                    У Вас ще немає замовлень
                </Typography>
            ) : (
                data.orders.map((order) => {
                    // Вычисляем итоговую цену для заказа
                    const totalPrice = order.items.reduce((total, item) => total + item.price, 0);

                    return (
                        <Box key={order.orderId} sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <Box sx={{ display: 'flex', margin: '10px 0 0 10px' }} >
                                <Box flex="1">
                                    <Typography variant="subtitle1">Номер замовлення: {order.orderId}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">Дата: {order.date}</Typography>
                                    <Typography variant="body2" color={order.status === "виконан" ? "green" : order.status === "отменен" ? "red" : "orange"}>
                                        Статус: {order.status}
                                    </Typography>
                                </Box>

                                {/* Отображаем товары */}
                                <Box flex="3">
                                    {/* Группировка товаров с использованием `forEach` */}
                                    {(() => {
                                        const groupedItems: { [key: string]: any } = {};

                                        // Проходим по каждому товару и группируем их по `shortName`
                                        order.items.forEach((item: any) => {
                                            if (groupedItems[item.shortName]) {
                                                groupedItems[item.shortName].quantity += 1; // Увеличиваем количество, если товар уже есть
                                            } else {
                                                groupedItems[item.shortName] = { ...item, quantity: 1 }; // Добавляем новый товар с количеством 1
                                            }
                                        });

                                        // Отображаем сгруппированные товары
                                        return Object.values(groupedItems).map((item: any, index: number) => (
                                            <Box key={index} display="flex" alignItems="center" justifyContent="space-between" sx={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                                {/* Колонка с названием товара */}
                                                <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.shortName}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{item.longName}</Typography>
                                                </Box>
                                                {/* Колонка с изображением */}
                                                <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                    <img src={item.imageSrc} alt="Товар" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                                </Box>
                                                {/* Колонка с ценой и количеством */}
                                                <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ціна: {item.price * item.quantity} грн</Typography>
                                                    {item.quantity > 1 && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.quantity} x {item.price} грн
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        ));
                                    })()}
                                </Box>

                                <ExpandMoreIcon onClick={() => handleToggle(order.orderId)} style={{ cursor: 'pointer' }} />
                            </Box>

                            {expandedOrderId === order.orderId && (
                                <Accordion expanded={expandedOrderId === order.orderId} onChange={() => handleToggle(order.orderId)}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography sx={{ fontWeight: 'bold', color: 'darkblue', textDecoration: 'underline', fontSize: '22px' }}>Деталі замовлення</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {/* Выводим сумму заказа */}
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 3, fontSize: '16px' }}>
                                            Загальна сума замовлення:&nbsp;
                                            <Typography component="span" sx={{ color: 'red', fontWeight: 'bold' }}>
                                                {totalPrice} грн
                                            </Typography>
                                        </Typography>
                                        {order.items.map((item, index) => (
                                            <Box key={index} mb={2} display="flex" justifyContent="space-between" alignItems="center">
                                                <Box flex="1">
                                                    <Divider />
                                                    <Typography variant="body2" mt={1}>{item.longName}</Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        ml: 2,
                                                        backgroundColor: '#00AAAD',
                                                        color: '#FFFFFF',
                                                        '&:hover': {
                                                            color: 'red',
                                                            backgroundColor: '#00AAAD',
                                                            borderColor: '#00AAAD'
                                                        },
                                                        borderColor: '#00AAAD'
                                                    }}
                                                    onClick={() => handleOpenReviewModal(order.orderId, item)}
                                                >
                                                    Залишити відгук
                                                </Button>
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            )}
                            {reviewModalOpen && selectedProduct && (
                                <ReviewDialog
                                    onClose={handleCloseReviewModal}
                                    wareId={selectedProduct.id}
                                />
                            )}
                        </Box>
                    );
                })
            )}
        </Box>
    );
}

