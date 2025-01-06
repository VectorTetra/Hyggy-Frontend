import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export class WareItemQueryParams {
    SearchParameter: string = "Query";
    Id?: number | null;
    Article?: number | null;
    WareId?: number | null;
    WareName?: string | null;
    WareDescription?: string | null;
    MinPrice?: number | null;
    MaxPrice?: number | null;
    MinDiscount?: number | null;
    MaxDiscount?: number | null;
    StatusId?: number | null;
    WareCategory1Id?: number | null;
    WareCategory2Id?: number | null;
    WareCategory3Id?: number | null;
    WareImageId?: number | null;
    PriceHistoryId?: number | null;
    OrderItemId?: number | null;
    IsDeliveryAvailable?: boolean | null;
    StorageId?: number | null;
    ShopId?: number | null;
    MinQuantity?: number | null;
    MaxQuantity?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    Sorting?: string | null;
    StringIds?: string | null;
    QueryAny?: string | null;
}

export class WareItemPostDTO {
    WareId: number;
    StorageId: number;
    Quantity: number;
}
export class WareItemPutDTO {
    Id: number;
    WareId: number;
    StorageId: number;
    Quantity: number;
}
export class WareItem {
    id: number;
    wareId: number;
    storageId: number;
    quantity: number;
    totalSum: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_ITEM;
if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_ITEM in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_ITEM in your environment variables.");
}
// GET запит (вже реалізований)
export async function getWareItems(params: WareItemQueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get(API_BASE_URL!, {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching WareItems:', error);
        throw new Error('Failed to fetch WareItems');
    }
}

// POST запит для створення нового складу
export async function postWareItem(WareItem: WareItemPostDTO) {
    try {
        const response = await axios.post(API_BASE_URL!, WareItem);
        return response.data;
    } catch (error) {
        console.error('Error creating WareItem:', error);
        throw new Error('Failed to create WareItem');
    }
}

// PUT запит для оновлення існуючого складу
export async function putWareItem(WareItem: WareItemPutDTO) {
    try {
        if (!WareItem.Id) {
            throw new Error('Id is required for updating a WareItem');
        }

        const response = await axios.put(API_BASE_URL!, WareItem);
        return response.data;
    } catch (error) {
        console.error('Error updating WareItem:', error);
        throw new Error('Failed to update WareItem');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteWareItem(id: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL!}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting WareItem:', error);
        throw new Error('Failed to delete WareItem');
    }
}

// Використання useQuery для отримання списку складів (wareItems)
export function useWareItems(params: WareItemQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['wareItems', params],
        queryFn: () => getWareItems(params),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000 * 5,
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
        enabled: isEnabled
    });
}

// Використання useMutation для створення нового складу (wareItem)
export function useCreateWareItem() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newWareItem: WareItemPostDTO) => postWareItem(newWareItem),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareItems'] }); // Оновлює кеш даних після створення складу
            },
        });
}

// Використання useMutation для оновлення існуючого складу (wareItem)
export function useUpdateWareItem() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newWareItem: WareItemPutDTO) => putWareItem(newWareItem),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareItems'] }); // Оновлює кеш даних після оновлення складу
            },
        });
}

// Використання useMutation для видалення складу (wareItem)
export function useDeleteWareItem() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: number) => deleteWareItem(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareItems'] }); // Оновлює кеш даних після видалення складу
            },
        });
}
