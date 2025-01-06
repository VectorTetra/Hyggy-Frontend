import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface EmployeeQueryPL {
    Id?: string | null;
    Email?: string | null;
    Name?: string | null;
    Surname?: string | null;
    PhoneNumber?: string | null;
    DateOfBirth?: Date | null;
    RoleName?: string | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    Sorting?: string | null;
    QueryAny?: string | null;
    StringIds?: string | null;
}
export interface ShopEmployeePostDto {
    Id?: string;
    Name?: string;
    Surname?: string;
    Email?: string;
    PhoneNumber?: string;
    Password?: string;
    ConfirmPassword?: string;
    ShopId: number;
    RoleName: string;
}
export interface ShopEmployeePutDto {
    Id: string;
    Name: string;
    Surname: string;
    Email: string;
    PhoneNumber: string | null;
    OldPassword: string | null;
    NewPassword: string | null;
    ShopId: number;
    RoleName: string;
}
export interface StorageEmployeePostDto {
    Id?: string;
    Name?: string;
    Surname?: string;
    Email?: string;
    PhoneNumber?: string;
    Password?: string;
    ConfirmPassword?: string;
    StorageId: number;
    RoleName: string;
}
export interface StorageEmployeePutDto {
    Id: string;
    Name: string;
    Surname: string;
    Email: string;
    PhoneNumber: string | null;
    OldPassword: string | null;
    NewPassword: string | null;
    StorageId: number;
    RoleName: string;
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
export async function getShopEmployees(params: EmployeeQueryPL) {
    try {
        const response = await axios.get(`${API_SHOP_EMPLOYEE_URL}/shopemployee-query`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching ShopEmployees:', error);
        throw new Error('Failed to fetch ShopEmployees');
    }
}
export async function postShopEmployee(Shop: ShopEmployeePostDto) {
    try {
        const response = await axios.post(`${API_SHOP_EMPLOYEE_URL}/register`, Shop);
        return response.data;
    } catch (error) {
        console.error('Error creating ShopEmployee:', error);
        throw new Error('Failed to create ShopEmployee');
    }
}
export async function putShopEmployee(Shop: ShopEmployeePutDto) {
    try {
        const response = await axios.put(`${API_SHOP_EMPLOYEE_URL}/editemployee`, Shop);
        return response.data;
    } catch (error) {
        console.error('Error updating ShopEmployee:', error);
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
export async function getStorageEmployees(params: EmployeeQueryPL) {
    try {
        const response = await axios.get(`${API_STORAGE_EMPLOYEE_URL}/storageemployee-query`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching StorageEmployees:', error);
        throw new Error('Failed to fetch StorageEmployees');
    }
}
export async function postStorageEmployee(Storage: StorageEmployeePostDto) {
    try {
        const response = await axios.post(`${API_STORAGE_EMPLOYEE_URL}/register`, Storage);
        return response.data;
    } catch (error) {
        console.error('Error creating StorageEmployee:', error);
        throw new Error('Failed to create StorageEmployee');
    }
}

export async function putStorageEmployee(StorageEmployee: StorageEmployeePutDto) {
    try {
        const response = await axios.put(`${API_STORAGE_EMPLOYEE_URL}/editemployee`, StorageEmployee);
        return response.data;
    } catch (error) {
        console.error('Error updating ShopEmployee:', error);
        throw new Error('Failed to create ShopEmployee');
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

export function useShopEmployees(params: EmployeeQueryPL, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['shopEmployees'],
        queryFn: () => getShopEmployees(params),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000 * 5,
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
        enabled: isEnabled,
    });
}

export function useStorageEmployees(params: EmployeeQueryPL, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['storageEmployees'],
        queryFn: () => getStorageEmployees(params),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000 * 5,
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
        enabled: isEnabled,
    });
}

export function useShopEmployeePost() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newShopEmployee: ShopEmployeePostDto) => postShopEmployee(newShopEmployee),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['shopEmployees'] }); // Оновлює кеш даних після створення складу
            },
        });
}

export function useShopEmployeePut() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newShopEmployee: ShopEmployeePutDto) => putShopEmployee(newShopEmployee),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['shopEmployees'] }); // Оновлює кеш даних після створення складу
            },
        });
}

export function useStorageEmployeePost() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newStorageEmployee: StorageEmployeePostDto) => postStorageEmployee(newStorageEmployee),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['storageEmployees'] }); // Оновлює кеш даних після створення складу
            },
        });
}

export function useStorageEmployeePut() {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (newStorageEmployee: StorageEmployeePutDto) => putStorageEmployee(newStorageEmployee),
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

