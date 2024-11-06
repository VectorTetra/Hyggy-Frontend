import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export class CustomerQueryParams {
    SearchParameter: string = "Query";
    Id?: string | null;
    Name?: string | null;
    Surname?: string | null;
    Email?: string | null;
    PhoneNumber?: string | null;
    OrderId?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    StringIds?: string | null;
    Sorting?: string | null;
    QueryAny?: string | null;
}

export class CustomerPutDTO {
    Id: string;
    Name: string
    Surname: string;
    Email: string;
    PhoneNumber?: string | null;
    AvatarPath?: string | null;
    FavoriteWareIds: number[];
    OrderIds: number[];
}
export class Customer {
    id: string;
    name: string
    surname: string;
    orderIds: number[];
    email: string;
    emailConfirmed: boolean;
    phoneNumber?: string | null;
    avatarPath?: string | null;
    favoriteWareIds: number[];
    executedOrdersSum: number;
    executedOrdersAvg: number;
}

// GET запит (вже реалізований)
export async function getCustomers(params: CustomerQueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/Customer', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Customers:', error);
        throw new Error('Failed to fetch Customers');
    }
}

// PUT запит для оновлення існуючого складу
export async function putCustomer(Customer: CustomerPutDTO) {
    try {
        if (!Customer.Id) {
            throw new Error('Id is required for updating a Customer');
        }

        const response = await axios.put(`http://www.hyggy.somee.com/api/Customer`, Customer);
        return response.data;
    } catch (error) {
        console.error('Error updating Customer:', error);
        throw new Error('Failed to update Customer');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteCustomer(id: string) {
    try {
        const response = await axios.delete(`http://www.hyggy.somee.com/api/Customer/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Customer:', error);
        throw new Error('Failed to delete Customer');
    }
}

// Використання useQuery для отримання списку складів (customers)
export function useCustomers(params: CustomerQueryParams = { SearchParameter: "Query" }) {
    return useQuery(['customers', params], () => getCustomers(params), {
        staleTime: Infinity, // Дані залишаються актуальними завжди
        cacheTime: Infinity, // Дані залишаються в кеші без очищення
        refetchOnWindowFocus: false, // Не рефетчити при фокусуванні вікна
    });
}

// Використання useMutation для оновлення існуючого складу (customer)
export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation(
        (updatedCustomer: CustomerPutDTO) => putCustomer(updatedCustomer),
        {
            onSuccess: () => {
                // Інвалідуємо і рефетчимо дані клієнтів
                queryClient.invalidateQueries('customers', { refetchActive: true });
            },
        }
    );
}



// Використання useMutation для видалення складу (customer)
export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation((id: string) => deleteCustomer(id), {
        onSuccess: () => {
            queryClient.invalidateQueries('customers', { refetchActive: true });
        },
    });
}

