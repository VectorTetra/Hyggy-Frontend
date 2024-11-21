import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API запити
export async function getWareCategories3(params) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/WareCategory3', { params });
		return response.data;
	} catch (error) {
		console.error('Error fetching WareCategory3s:', error);
		throw new Error('Failed to fetch WareCategory3s');
	}
}

export async function postWareCategory3(WareCategory3) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/WareCategory3', WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error creating WareCategory3:', error);
		throw new Error('Failed to create WareCategory3');
	}
}

export async function putWareCategory3(WareCategory3) {
	try {
		const response = await axios.put('http://www.hyggy.somee.com/api/WareCategory3', WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error updating WareCategory3:', error);
		throw new Error('Failed to update WareCategory3');
	}
}

export async function deleteWareCategory3(id) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/WareCategory3/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareCategory3:', error);
		throw new Error('Failed to delete WareCategory3');
	}
}

// Використання useQuery для отримання даних
export function useWareCategories3(params) {
	return useQuery({
		queryKey: ['wareCategories3', params],
		queryFn: () => getWareCategories3(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для мутацій
export function useCreateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory3) => postWareCategory3(newWareCategory3),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

export function useUpdateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory3) => putWareCategory3(newWareCategory3),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

export function useDeleteWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id) => deleteWareCategory3(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після видалення
			},
		}
	);
}
