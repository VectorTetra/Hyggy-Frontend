import { formatCurrency } from "@/app/sharedComponents/methods/formatCurrency";
import ReviewDialog from '@/app/sharedComponents/ReviewDialog';
import { OrderGetDTO, useOrders } from "@/pages/api/OrderApi";
import { getDecodedToken } from "@/pages/api/TokenApi";
import { WareGetDTO } from "@/pages/api/WareApi";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, Table, TableCell, TableRow, Typography } from '@mui/material';
import Link from "next/link";
import { useState } from "react";


export default function OrdersUser() {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<WareGetDTO | null>(null);

    const handleToggle = (orderId) => {
        setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedProduct(null);
    };

    const {
        data: orders = [] as OrderGetDTO[],
        isFetching: dataLoading,
        isSuccess: success,
    } = useOrders({
        SearchParameter: 'Query',
        PageNumber: 1,
        PageSize: 1000,
        CustomerId: getDecodedToken()?.nameid ?? null,
    });
    //Проверка на наличие заказов
    const hasOrders = orders && orders.length > 0;

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9', margin: '20px 0' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '10px',
                }}>
                <Typography
                    sx={{
                        fontSize: { xs: '20px', sm: '22px', md: '26px', lg: '30px' },
                        fontWeight: 'bold',
                    }}
                    variant="h4" gutterBottom>
                    Мої замовлення
                </Typography>
            </Box>
            {!hasOrders ? ( // Проверка на наличие заказов
                <Typography variant="body1" color="text.secondary" align="center">
                    У Вас ще немає замовлень
                </Typography>
            ) : (
                orders.map((order) => {
                    // Вычисляем итоговую цену для заказа
                    const totalPrice = order.totalPrice;

                    return (
                        <Box key={order.id} sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    margin: '10px 0 0 10px',
                                    flexDirection: { xs: 'column', sm: 'column' }
                                }}
                            >
                                {/* <Box flex="1" sx={{ marginBottom: { xs: '10px', sm: '0' } }}> */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: 'column', sm: 'row', }, // Меняем направление при адаптиве
                                        justifyContent: "start",
                                        alignItems: "center",
                                        width: "100%",
                                    }}>
                                    <Box sx={{ display: "flex", justifyContent: "start", flex: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontFamily: 'inherit',
                                                display: 'flex',
                                            }}
                                        >
                                            Номер замовлення: {order.id}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "start", flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'inherit',
                                                display: 'flex',
                                            }}
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            Дата: {new Date(order.orderDate).toLocaleString('uk-UA')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "start", flex: 1 }}>
                                        <Typography sx={{
                                            fontFamily: 'inherit',
                                            display: 'flex',
                                            flexBasis: "250px"
                                        }}
                                            variant="body2"
                                            color={[7, 12].includes(order.status.id) ? "green" : order.status.name === "Скасовано" ? "red" : "orange"}
                                        >
                                            Статус: {order.status.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "start", flex: 1 }}>
                                        <Typography variant="body2">
                                            Загальна сума :&nbsp;
                                            <Typography component="span"
                                                sx={{
                                                    fontFamily: 'inherit',
                                                    fontWeight: 'bold',
                                                }}>
                                                {formatCurrency(totalPrice, "грн")}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    <ExpandMoreIcon onClick={() => handleToggle(order.id)} style={{ cursor: 'pointer' }} />
                                </Box>
                                <Collapse in={expandedOrderId === order.id} timeout={300} unmountOnExit sx={{ width: "100%" }}>
                                    <Box flex="3" sx={{ marginBottom: { xs: '10px', sm: '10px' }, width: "100%" }}>
                                        {
                                            // Отображаем сгруппированные товары
                                            order.orderItems.map((item: any, index: number) => (
                                                <Box key={index} display="flex" alignItems="center" justifyContent="space-between"
                                                    sx={{
                                                        flexDirection: { xs: 'column', sm: 'row' }, // Меняем направление при адаптиве
                                                        padding: '10px',
                                                        borderBottom: '1px solid #ddd'
                                                    }}>
                                                    {/* Колонка с изображением */}
                                                    <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                        <Link href={`/ware/${item.ware.id}`}>
                                                            <img src={item.ware.previewImagePath} alt="Товар" style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover', margin: '10px 0 15px 0' }} />
                                                        </Link>
                                                    </Box>

                                                    {/* Колонка с названием товара */}
                                                    <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.ware.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{item.ware.description}</Typography>
                                                    </Box>


                                                    {/* Колонка с ценой и количеством */}
                                                    <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Ціна: {formatCurrency(item.ware.finalPrice * item.count, "грн")}</Typography>
                                                        {item.count > 1 && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {item.count} x {formatCurrency(item.ware.finalPrice, "грн")}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))

                                        }
                                        <Table
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    padding: '8px 16px',
                                                    border: "none"
                                                },
                                                margin: '16px 0 0 0',
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontFamily: 'inherit',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        Загальна вартість товарів: {formatCurrency(order.totalPrice - order.deliveryType.price, "грн")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontFamily: 'inherit',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        Вибраний тип доставки: {order.deliveryType.name}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontFamily: 'inherit',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        Вартість доставки: {formatCurrency(order.deliveryType.price, "грн")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontFamily: 'inherit',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        Загальна вартість замовлення: {formatCurrency(order.totalPrice, "грн")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </Box>
                                </Collapse>
                            </Box>
                            {
                                reviewModalOpen && selectedProduct && (
                                    <ReviewDialog
                                        onClose={handleCloseReviewModal}
                                        wareId={selectedProduct.id}
                                    />
                                )
                            }
                        </Box>
                    );
                })
            )}
        </Box >
    );
}

