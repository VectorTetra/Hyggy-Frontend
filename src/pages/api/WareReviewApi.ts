import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export class WareReviewQueryParams {
    SearchParameter: string = "Query";
    Id?: number | null;
    WareId?: number | null;
    Text?: string | null;
    Theme?: string | null;
    CustomerName?: string | null;
    AuthorizedCustomerId?: string | null;
    Email?: string | null;
    MaxRating?: number | null;
    MinRating?: number | null;
    MaxDate?: Date | null;
    MinDate?: Date | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    Sorting?: string | null;
    StringIds?: string | null;
    QueryAny?: string | null;
}

export class WareReviewPostDTO {
    Text: string;
    Theme: string;
    CustomerName: string;
    WareId: number;
    AuthorizedCustomerId: string | null;
    Email: string;
    Rating: number;
}
export class WareReviewPutDTO {
    Id: number;
    Text: string;
    Theme: string;
    CustomerName: string;
    WareId: number;
    AuthorizedCustomerId: string | null;
    Email: string;
    Rating: number;
}
export class WareReview {
    id: number;
    text: string;
    theme: string;
    customerName: string;
    wareId: number;
    warePreviewImagePath: string | null;
    wareName: string;
    wareDescription: string;
    date: Date;
    authorizedCustomerId: string | null;
    email: string;
    rating: number;
}
// GET запит (вже реалізований)
export async function getWareReviews(params: WareReviewQueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/WareReview', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching WareReviews:', error);
        throw new Error('Failed to fetch WareReviews');
    }
}

// POST запит для створення нового складу
export async function postWareReview(WareReview: WareReviewPostDTO) {
    try {
        const response = await axios.post('http://www.hyggy.somee.com/api/WareReview', WareReview);
        return response.data;
    } catch (error) {
        console.error('Error creating WareReview:', error);
        throw new Error('Failed to create WareReview');
    }
}

// PUT запит для оновлення існуючого складу
export async function putWareReview(WareReview: WareReviewPutDTO) {
    try {
        if (!WareReview.Id) {
            throw new Error('Id is required for updating a WareReview');
        }

        const response = await axios.put(`http://www.hyggy.somee.com/api/WareReview`, WareReview);
        return response.data;
    } catch (error) {
        console.error('Error updating WareReview:', error);
        throw new Error('Failed to update WareReview');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteWareReview(id: number) {
    try {
        const response = await axios.delete(`http://www.hyggy.somee.com/api/WareReview/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting WareReview:', error);
        throw new Error('Failed to delete WareReview');
    }
}

// Використання useQuery для отримання списку складів (wareReviews)
export function useWareReviews(params: WareReviewQueryParams = { SearchParameter: "Query" }) {
    return useQuery({
        queryKey: ['wareReviews', params],
        queryFn: () => getWareReviews(params),
        staleTime: Infinity, // Дані завжди актуальні
        gcTime: Infinity, // Дані залишаються в кеші без очищення
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
    });
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareReview() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newWareReview: WareReviewPostDTO) => postWareReview(newWareReview),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareReviews'] }); // Оновлює кеш даних після створення складу
            },
        });
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareReview() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newWareReview: WareReviewPutDTO) => putWareReview(newWareReview),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareReviews'] }); // Оновлює кеш даних після створення складу
            },
        });
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareReview() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: number) => deleteWareReview(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wareReviews'] }); // Оновлює кеш даних після видалення складу
            },
        });
}
