import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


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
export class GuestCustomerPostDTO {
    Name: string
    Surname: string;
    Email: string;
    PhoneNumber: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER in your environment variables.");
}

// GET запит (вже реалізований)
export async function getCustomers(params: CustomerQueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get(API_BASE_URL!, {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Customers:', error);
        throw new Error('Failed to fetch Customers');
    }
}

// POST запит для створення або отримання гостьового користувача
export async function postOrFindGuestCustomer(Customer: GuestCustomerPostDTO) {
    try {
        const response = await axios.post(`${API_BASE_URL!}/createOrFindGuest`, Customer);
        return response.data;
    } catch (error) {
        console.error('Error updating Customer:', error);
        throw new Error('Failed to update Customer');
    }
}

// PUT запит для оновлення існуючого складу
export async function putCustomer(Customer: CustomerPutDTO) {
    try {
        if (!Customer.Id) {
            throw new Error('Id is required for updating a Customer');
        }

        const response = await axios.put(API_BASE_URL!, Customer);
        return response.data;
    } catch (error) {
        console.error('Error updating Customer:', error);
        throw new Error('Failed to update Customer');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteCustomer(id: string) {
    try {
        const response = await axios.delete(`${API_BASE_URL!}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Customer:', error);
        throw new Error('Failed to delete Customer');
    }
}

// Використання useQuery для отримання списку складів (customers)
export function useCustomers(params: CustomerQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['customers', params],
        queryFn: () => getCustomers(params),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000 * 5,
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
        enabled: isEnabled, // Запит відбувається тільки при значенні true
    });
}

// Використання useMutation для створення нового складу (customer)
export function useCreateOrFindGuestCustomer() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newCustomer: GuestCustomerPostDTO) => postOrFindGuestCustomer(newCustomer),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['customers'] }); // Оновлює кеш даних після створення складу
            },
        });
}

// Використання useMutation для оновлення існуючого складу (customer)
export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (updatedCustomer: CustomerPutDTO) => putCustomer(updatedCustomer),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['customers'] }); // Оновлює кеш даних після оновлення складу
            },
        });
}



// Використання useMutation для видалення складу (customer)
export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: string) => deleteCustomer(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['customers'] }); // Оновлює кеш даних після оновлення складу
            },
        });
}

