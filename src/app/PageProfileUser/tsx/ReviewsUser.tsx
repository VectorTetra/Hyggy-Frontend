import { getDecodedToken } from "@/pages/api/TokenApi";
import { useWareReviews } from "@/pages/api/WareReviewApi";
import { Avatar, Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useState } from "react";
import StarRating from '../../sharedComponents/StarRating';

export default function ReviewsUser() {

    const {
        data: reviews = [],
    } = useWareReviews({
        SearchParameter: 'Query',
        Sorting: 'DateDesc',
        PageNumber: 1,
        PageSize: 1000,
        AuthorizedCustomerId: getDecodedToken()?.nameid ?? null,
    });
    // Проверка на наличие отзывов
    const hasReviews = reviews && reviews.length > 0;


    // Состояния раскрытия для каждого отзыва
    const [expandedReviews, setExpandedReviews] = useState({});

    // Обработчик переключения состояния для конкретного отзыва
    const handleToggleExpand = (index) => {
        setExpandedReviews((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Переключаем текущее состояние
        }));
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9', margin: '20px 0' }}>
            <Box sx={{
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
                    Мої відгуки
                </Typography>
            </Box>

            {!hasReviews ? (
                <Typography variant="body1" color="text.secondary" align="center">
                    У Вас ще немає відгуків
                </Typography>
            ) : (
                <TableContainer
                    sx={{
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    component={Box}>
                    <Table sx={{ display: { xs: 'flex', md: 'table' } }}>
                        <TableBody
                            sx={{
                                display: { xs: 'flex', flexDirection: 'column', md: 'table-row', flex: 1 },
                            }}
                        >
                            {reviews.map((review, index) => (
                                <TableRow key={index}
                                    sx={{
                                        display: { xs: 'flex', md: 'table-row' },
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottom: { xs: '1px solid #ddd', md: 'none' },
                                        padding: { xs: '20px', md: '0' },
                                        marginBottom: { xs: '16px', md: '0' },
                                    }}
                                >
                                    {/* Имя пользователя и рейтинг */}
                                    <TableCell sx={{
                                        display: { xs: 'flex', md: 'table-cell' },
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: { xs: 'flex-start', md: 'center' },
                                        padding: { xs: '10px 0', md: '16px' },
                                    }}>
                                        <Typography variant="body1" >
                                            {review.customerName}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={0.5}>
                                            <StarRating rating={Number(review.rating)} />
                                        </Box>
                                    </TableCell>

                                    {/* Фото товара */}
                                    <TableCell
                                        sx={{
                                            display: { xs: 'flex', md: 'table-cell' },
                                            justifyContent: { xs: 'center', md: 'flex-start' },
                                            marginBottom: { xs: '10px', md: '0' },
                                        }}
                                    >
                                        <Avatar variant="square" src={review.warePreviewImagePath} alt={review.wareName} sx={{ width: 60, height: 60 }} />
                                    </TableCell>

                                    {/* Описание товара */}
                                    <TableCell
                                        sx={{
                                            display: { xs: 'flex', md: 'table-cell' },
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            padding: { xs: '10px', md: '16px' },
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold">
                                            {review.wareName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {review.wareDescription}
                                        </Typography>
                                    </TableCell>

                                    {/* Текст отзыва */}
                                    <TableCell
                                        sx={{
                                            display: { xs: 'block', md: 'table-cell' },
                                            marginBottom: { xs: '10px', md: '0' },
                                            marginLeft: { xs: '0', md: '0' },
                                            padding: { xs: '0', md: '0' },
                                            paddingTop: { xs: '10px', md: '0' },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: expandedReviews[index] ? 'block' : '-webkit-box',
                                                WebkitLineClamp: expandedReviews[index] ? 'none' : 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: expandedReviews[index] ? 'visible' : 'hidden',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleToggleExpand(index)} // Обработчик клика
                                        >
                                            {review.text}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
            }
        </Box >
    );
}
