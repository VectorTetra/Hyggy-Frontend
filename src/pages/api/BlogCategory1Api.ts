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
export async function getBlogCategories(params: BlogCategory1Query = { SearchParameter: "Paged", PageNumber: 1, PageSize: 4 }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/BlogCategory1', {
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
}) {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () => getBlogCategories(params),
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false
    });
}