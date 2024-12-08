import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export class BlogQueryParams {
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

export class BlogPostDTO {
	BlogCategory2Id: number;
	BlogTitle: string;
	FilePath: string;
	Keywords: string | null;
	PreviewImagePath: string | null;
}

export class BlogPutDTO {
	Id: number;
	BlogCategory2Id: number;
	BlogTitle: string;
	FilePath: string;
	Keywords: string | null;
	PreviewImagePath: string | null;
}

export class Blog {
	id: number;
	blogCategory2Id: number;
	blogCategory1Id: number;
	blogCategory2Name: string;
	blogCategory1Name: string;
	blogTitle: string;
	keywords: string;
	filePath: string;
	previewImagePath: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_BLOG in your environment variables.");
}

// GET запит (вже реалізований)
export async function getBlogs(params: BlogQueryParams = { SearchParameter: "Query" }) {
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

// POST запит для створення нового складу
export async function postBlog(Blog: BlogPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Blog);
		return response.data;
	} catch (error) {
		console.error('Error creating Blog:', error);
		throw new Error('Failed to create Blog');
	}
}

// PUT запит для оновлення існуючого складу
export async function putBlog(Blog: BlogPutDTO) {
	try {
		if (!Blog.Id) {
			throw new Error('Id is required for updating a Blog');
		}

		const response = await axios.put(API_BASE_URL!, Blog);
		return response.data;
	} catch (error) {
		console.error('Error updating Blog:', error);
		throw new Error('Failed to update Blog');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteBlog(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Blog:', error);
		throw new Error('Failed to delete Blog');
	}
}

export async function getJsonConstructorFile(filePath: string) {
	try {
		const response = await axios.get(`${filePath}?timestamp=${new Date().getTime()}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching JSON constructor file:', error);
		throw new Error('Failed to fetch JSON constructor file');
	}
}

export async function postJsonConstructorFile(structureArray: any[] | null) {

	const jsonString = JSON.stringify(structureArray);
	const formData = new FormData();
	formData.append('JsonConstructorItems', jsonString);

	try {
		const response = await axios.post<string>(`${API_BASE_URL!}/PostJsonConstructorFile`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		// Повертаємо дані відповіді
		return response.data;
	} catch (error) {
		// Обробка помилки
		toast.error("Error posting JSON constructor file:", error);
		// Можна додати додаткову логіку для обробки помилок (наприклад, повідомлення користувачу)
		throw new Error("Failed to post JSON constructor file");
	}
}

export async function putJsonConstructorFile(structureArray: any[] | null, oldConstructorFilePath: string) {

	const jsonString = JSON.stringify(structureArray);
	const formData = new FormData();
	formData.append('oldConstructorFilePath', oldConstructorFilePath);
	formData.append('JsonConstructorItems', jsonString);

	try {
		const response = await axios.put<string>(`${API_BASE_URL!}/PutJsonConstructorFile`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		// Повертаємо дані відповіді
		return response.data;
	} catch (error) {
		// Обробка помилки
		toast.error("Error posting JSON constructor file:", error);
		// Можна додати додаткову логіку для обробки помилок (наприклад, повідомлення користувачу)
		throw new Error("Failed to post JSON constructor file");
	}
}

// Використання useQuery для отримання списку складів (blogs)
export function useBlogs(params: BlogQueryParams = { SearchParameter: "Query" }) {
	return useQuery({
		queryKey: ['blogs', params],
		queryFn: () => getBlogs(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (blog)
export function useCreateBlog() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newBlog: BlogPostDTO) => postBlog(newBlog),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (blog)
export function useUpdateBlog() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newBlog: BlogPutDTO) => putBlog(newBlog),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Оновлює кеш даних після оновлення складу
			},
		}
	);
}

// Використання useMutation для видалення складу (blog)
export function useDeleteBlog() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteBlog(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Оновлює кеш даних після видалення складу
			},
		}
	);
}

