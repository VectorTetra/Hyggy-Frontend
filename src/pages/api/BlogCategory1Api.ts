import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBlogs } from './BlogApi';

export class BlogCategory1Query {
    SearchParameter: string = "Query";
    Id?: number | null;
    BlogTitle?: string | null;
    Keyword?: string | null;
    FilePath?: string | null;
    PreviewImagePath?: string | null;
    BlogCategory1Name?: string | null;
    BlogCategory2Name?: string | null;
    BlogCategory1Id?: number | null;
    BlogCategory2Id?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    StringIds?: string | null;
    Sorting?: string | null;
    QueryAny?: string | null;
}
export class BlogCategory1 {
    id: number;
    name: string;
    blogCategory2Ids: number[] = [];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_1;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_1 in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG_CATEGORY_1 in your environment variables.");
}

export async function getBlogCategories(params: BlogCategory1Query = { SearchParameter: "Paged", PageNumber: 1, PageSize: 4 }) {
    try {
        const response = await axios.get(API_BASE_URL!, {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Blogs:', error);
        throw new Error('Failed to fetch Blogs');
    }
}

export function useBlogsCategories1(params: BlogCategory1Query = {
    SearchParameter: "Paged", PageNumber: 1, PageSize: 10
}, isEnabled: boolean = true) {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () => getBlogCategories(params),
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: isEnabled,
    });
}