"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Typography, Box, ThemeProvider } from '@mui/material';
import InputMask from 'react-input-mask';  // Імпортуємо InputMask
import { Customer, useUpdateCustomer } from "@/pages/api/CustomerApi";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
import { getDecodedToken, removeToken } from "@/pages/api/TokenApi";
import { useDeleteCustomer } from "@/pages/api/CustomerApi";
import ConfirmationDialog from "@/app/sharedComponents/ConfirmationDialog";
import themeFrame from "@/app/AdminPanel/tsx/ThemeFrame";

export default function EditProfileUser({ onSave, user }: { onSave: any, user: Customer }) {
    const [isDeletingDialogOpen, setIsDeletingDialogOpen] = useState(false);
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [phone, setPhone] = useState(user.phoneNumber ? user.phoneNumber : "");
    const formattedPhone = phone.replace(/[^\d+]/g, "");
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync: updateCustomer } = useUpdateCustomer();
    const { mutateAsync: deleteCustomer } = useDeleteCustomer();
    const handleSaveChanges = async () => {
        console.log("user", user);
        await updateCustomer(
            {
                Name: name,
                Surname: surname,
                Email: user.email,
                Id: getDecodedToken()?.nameid || "",
                PhoneNumber: formattedPhone,
                AvatarPath: user.avatarPath,
                FavoriteWareIds: user.favoriteWareIds,
                OrderIds: user.orderIds
            }
            ,
            {
                onSuccess: () => {
                    console.log("Дані оновлено, починаємо рефетчинг...");
                    queryClient.invalidateQueries({ queryKey: ['customers'] });
                    toast.success("Дані успішно оновлено!");
                    onSave();
                },
                onError: (error) => {
                    toast.error("Помилка при оновленні даних!");
                    console.error("Помилка оновлення:", error);
                }
            }
        );
    };

    // Функция для удаления аккаунта
    const handleDeletedAccount = () => {
        const customerId = getDecodedToken()?.nameid;
        if (customerId) {
            deleteCustomer(customerId);
        }
        removeToken();
        router.push("/");
    };


    const handleCancel = () => {
        onSave();
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 2, margin: 4, width: '80%' }}>
                <Container maxWidth="sm" style={{ marginTop: '20px' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Редагування акаунту
                    </Typography>
                    <ThemeProvider theme={themeFrame}>
                        <Box display="flex" flexDirection="column" gap={2} mt={3}>
                            <TextField
                                label="Ім'я"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#00AAAD',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#008080',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#008080',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                label="Прізвище"
                                variant="outlined"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                fullWidth
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#00AAAD',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#008080',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#008080',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                label="Електронна пошта"
                                variant="outlined"
                                value={user.email}
                                disabled
                                fullWidth
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#00AAAD',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#008080',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#008080',
                                        },
                                    },
                                }}
                            />
                            <InputMask
                                mask="+38 (099) 999-99-99"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            >
                                {() => (
                                    <TextField
                                        label="Номер телефону"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: 2,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#00AAAD',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#008080',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#008080',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </InputMask>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button variant="outlined" color="primary" onClick={handleSaveChanges}
                                    sx={{
                                        backgroundColor: '#00AAAD',
                                        color: 'white',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'rgba(0,95,96,1)',
                                        },
                                        width: '48%', fontFamily: "inherit"
                                    }}>
                                    Зберегти
                                </Button>
                                <Button variant="outlined" color="primary" onClick={handleCancel}
                                    sx={{
                                        backgroundColor: '#00AAAD',
                                        color: 'white',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'rgba(0,95,96,1)',
                                        },
                                        width: '48%', fontFamily: "inherit"
                                    }}>
                                    Скасувати
                                </Button>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button variant="outlined" color="secondary" onClick={() => setIsDeletingDialogOpen(true)}
                                    sx={{
                                        backgroundColor: '#f74d4d',
                                        color: 'white',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'red',
                                        },
                                        width: '100%',
                                        fontFamily: "inherit"
                                    }}>
                                    Видалити акаунт
                                </Button>
                            </Box>
                        </Box>
                    </ThemeProvider>
                </Container>
            </Box>
            <ConfirmationDialog
                title="Видалити акаунт?"
                contentText={`Ви дійсно бажаєте видалити Ваш акаунт? Ця дія незворотня!`}
                onConfirm={handleDeletedAccount}
                onCancel={() => setIsDeletingDialogOpen(false)}
                confirmButtonBackgroundColor='#00AAAD'
                cancelButtonBackgroundColor='#fff'
                cancelButtonBorderColor='#be0f0f'
                cancelButtonColor='#be0f0f'
                open={isDeletingDialogOpen}
            />
        </Box>
    );
}
