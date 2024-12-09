import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export class BlogCategory2QueryParams {
    SearchParameter: string = "Query";
    Id?: number | null;
    BlogTitle?: string | null;
    Keyword?: string | null;
    FilePath?: string | null;
    PreviewImagePath?: string | null;
    BlogCategory1Id?: number | null;
    BlogCategory1Name?: string | null;
    BlogCategory2Name?: string | null;
    BlogId?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    Sorting?: string | null;
    StringIds?: string | null;
    QueryAny?: string | null;
}

export class BlogCategory2PostDTO {
    Name: string;
    BlogCategory1Id: number;
    PreviewImagePath: string | null;
}
export class BlogCategory2PutDTO {
    Id: number;
    Name: string;
    BlogCategory1Id: number;
    PreviewImagePath: string | null;
    BlogIds?: number[] = [];
}

export class BlogCategory2 {
    id: number;
    blogCategory1Id: number;
    blogCategory1Name: string;
    name: string;
    previewImagePath: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_2;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_2 in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_2 in your environment variables.");
}
// GET запит (вже реалізований)
export async function getBlogCategories2(params: BlogCategory2QueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get(API_BASE_URL!, {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching BlogCategory2s:', error);
        throw new Error('Failed to fetch BlogCategory2s');
    }
}

// POST запит для створення нового складу
export async function postBlogCategory2(BlogCategory2: BlogCategory2PostDTO) {
    try {
        const response = await axios.post(API_BASE_URL!, BlogCategory2);
        return response.data;
    } catch (error) {
        console.error('Error creating BlogCategory2:', error);
        throw new Error('Failed to create BlogCategory2');
    }
}

// PUT запит для оновлення існуючого складу
export async function putBlogCategory2(BlogCategory2: BlogCategory2PutDTO) {
    try {
        if (!BlogCategory2.Id) {
            throw new Error('Id is required for updating a BlogCategory2');
        }

        const response = await axios.put(API_BASE_URL!, BlogCategory2);
        return response.data;
    } catch (error) {
        console.error('Error updating BlogCategory2:', error);
        throw new Error('Failed to update BlogCategory2');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteBlogCategory2(id: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL!}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting BlogCategory2:', error);
        throw new Error('Failed to delete BlogCategory2');
    }
}

// Використання useQuery для отримання списку складів (blogCategories2)
export function useBlogCategories2(params: BlogCategory2QueryParams = { SearchParameter: "Paged", PageNumber: 1, PageSize: 50 }, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['blogCategories2', params],
        queryFn: () => getBlogCategories2(params),
        staleTime: Infinity, // Дані завжди актуальні
        gcTime: Infinity, // Дані залишаються в кеші без очищення
        refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
        enabled: isEnabled, // Запит виконується тільки при включеному параметрі isEnabled
    });
}

// Використання useMutation для створення нового складу (blog)
export function useCreateBlogCategory2() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (newCategory: BlogCategory2PostDTO) => postBlogCategory2(newCategory),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['blogCategories2'] }); // Оновлює кеш даних після створення складу
            },
        });
}

// Використання useMutation для оновлення існуючого складу (blog)
export function useUpdateBlogCategory2() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (updatedCategory: BlogCategory2PutDTO) => putBlogCategory2(updatedCategory),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['blogCategories2'] }); // Оновлює кеш даних після оновлення складу
            },
        });
}

// Використання useMutation для видалення складу (blog)
export function useDeleteBlogCategory2() {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (id: number) => deleteBlogCategory2(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['blogCategories2'] }); // Оновлює кеш даних після видалення складу
            },
        });
}
