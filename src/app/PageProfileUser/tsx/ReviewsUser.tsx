import React, { useState } from "react";
import StarRating from '../../sharedComponents/StarRating';
import styles from "../../ware/css/ReviewWare.module.css";
import { Box, Typography, Table, TableBody, TableContainer, TableRow, TableCell, Avatar, Button } from '@mui/material';
import data from '../PageProfileUser.json';

export default function ReviewsUser() {
    // Проверка на наличие отзывов
    const hasReviews = data.lastReviews && data.lastReviews.length > 0;


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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <Typography variant="h4" gutterBottom>
                    Мої відгуки
                </Typography>
            </Box>

            {!hasReviews ? (
                <Typography variant="body1" color="text.secondary" align="center">
                    У Вас ще немає відгуків
                </Typography>
            ) : (
                <TableContainer sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} component={Box}>
                    <Table>
                        <TableBody>
                            {data.lastReviews.map((review, index) => (
                                <TableRow key={index}>
                                    {/* Имя пользователя и рейтинг */}
                                    <TableCell sx={{ width: 150 }}>
                                        <Typography variant="body1" >
                                            {review.Username}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={0.5}>
                                            <StarRating rating={Number(review.rating)} />
                                        </Box>
                                    </TableCell>
                                    {/* Фото товара */}
                                    <TableCell>
                                        <Avatar variant="square" src={review.imageSrc} alt={review.shortName} sx={{ width: 60, height: 60 }} />
                                    </TableCell>
                                    {/* Описание товара */}
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {review.shortName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {review.longName}
                                        </Typography>
                                    </TableCell>
                                    {/* Текст отзыва */}
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: expandedReviews[index] ? 'block' : '-webkit-box',
                                                WebkitLineClamp: expandedReviews[index] ? 'none' : 3, // Убираем ограничение строк при разворачивании
                                                WebkitBoxOrient: 'vertical',
                                                overflow: expandedReviews[index] ? 'visible' : 'hidden', // Убираем обрезку текста
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
