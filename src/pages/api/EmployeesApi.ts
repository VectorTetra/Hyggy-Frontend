import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export interface ShopEmployeeDto {
    Id?: number;
    Name?: string;
    Surname?: string;
    Email?: string;
    Phone?: string;
    Password?: string;
    ConfirmPassword?: string;
    ShopId: number
}
export interface StorageEmployeeDto {
    Id?: number;
    Name?: string;
    Surname?: string;
    Email?: string;
    Phone?: string;
    Password?: string;
    ConfirmPassword?: string;
    StorageId: number
}
const API_STORAGE_EMPLOYEE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE;
if (!API_STORAGE_EMPLOYEE_URL) {
    console.error("API_STORAGE_EMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE in your environment variables.");
    throw new Error("API_STORAGE_EMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE in your environment variables.");
}

const API_SHOP_EMPLOYEE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE;
if (!API_SHOP_EMPLOYEE_URL) {
    console.error("API_SHOP_EMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE in your environment variables.");
    throw new Error("API_SHOP_EMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE in your environment variables.");
}

// GET запит (вже реалізований)
export async function getShopEmployees() {
    try {
        const response = await axios.get(`${API_SHOP_EMPLOYEE_URL}/shopemployes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ShopEmployees:', error);
        throw new Error('Failed to fetch ShopEmployees');
    }
}
export async function postShopEmployee(Shop: ShopEmployeeDto) {
    try {
        const response = await axios.post(`${API_SHOP_EMPLOYEE_URL}/register`, Shop);
        return response.data;
    } catch (error) {
        console.error('Error creating ShopEmployee:', error);
        throw new Error('Failed to create ShopEmployee');
    }
}
// DELETE запит для видалення складу за Id
export async function deleteShopEmployee(id: string) {
    try {
        const response = await axios.delete(`${API_SHOP_EMPLOYEE_URL}/deleteemployee?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ShopEmployee:', error);
        throw new Error('Failed to delete ShopEmployee');
    }
}
//Запиити для співробітників складів
export async function getStorageEmployees() {
    try {
        const response = await axios.get(`${API_STORAGE_EMPLOYEE_URL}/storageemployees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching StorageEmployees:', error);
        throw new Error('Failed to fetch StorageEmployees');
    }
}
export async function postStorageEmployee(Storage: StorageEmployeeDto) {
    try {
        const response = await axios.post(`${API_STORAGE_EMPLOYEE_URL}/register`, Storage);
        return response.data;
    } catch (error) {
        console.error('Error creating StorageEmployee:', error);
        throw new Error('Failed to create StorageEmployee');
    }
}
// DELETE запит для видалення складу за Id
export async function deleteStorageEmployee(id: string) {
    try {
        const response = await axios.delete(`${API_STORAGE_EMPLOYEE_URL}/deleteemployee?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting StorageEmployee:', error);
        throw new Error('Failed to delete StorageEmployee');
    }
}

export function useShopEmployees() {
    return useQuery({
        queryKey: ['shopEmployees'],
        queryFn: () => getShopEmployees(),
        staleTime: Infinity, // Дані завжди актуальні
        gcTime: Infinity, // Дані залишаються в кеші без очищення
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
    });
}

export function useStorageEmployees() {
    return useQuery({
        queryKey: ['storageEmployees'],
        queryFn: () => getStorageEmployees(),
        staleTime: Infinity, // Дані завжди актуальні
        gcTime: Infinity, // Дані залишаються в кеші без очищення
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
    });
}

export function useShopEmployeePost() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newShopEmployee: ShopEmployeeDto) => postShopEmployee(newShopEmployee),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['shopEmployees'] }); // Оновлює кеш даних після створення складу
            },
        });
}

export function useStorageEmployeePost() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newStorageEmployee: StorageEmployeeDto) => postStorageEmployee(newStorageEmployee),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['storageEmployees'] }); // Оновлює кеш даних після створення складу
            },
        });
}

export function useShopEmployeeDelete() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (id: string) => deleteShopEmployee(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['shopEmployees'] }); // Оновлює кеш даних після видалення складу
            },
        });
}

export function useStorageEmployeeDelete() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (id: string) => deleteStorageEmployee(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['storageEmployees'] }); // Оновлює кеш даних після видалення складу
            },
        });
}

