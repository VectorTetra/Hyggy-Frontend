// QueryClientWrapper.tsx
// "use client";
// import { ReactNode } from 'react';
// import { QueryClient, QueryClientProvider } from 'react-query';

// const queryClient = new QueryClient();

// const QueryClientWrapper = ({ children }: { children: ReactNode }) => (
// 	<QueryClientProvider client={queryClient}>
// 		{children}
// 	</QueryClientProvider>
// );

// export default QueryClientWrapper;

// QueryClientWrapper.tsx
"use client";
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60, // Кеш неактивних запитів зберігатиметься 60 хвилин перед видаленням
			staleTime: 1000 * 60 * 5, // Час актуальності кешованих даних
		},
	},
});

// Створення власного persister для localStorage
const localStoragePersister: Persister = {
	persistClient: async (client: PersistedClient) => {
		localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", JSON.stringify(client));
	},
	restoreClient: async (): Promise<PersistedClient | undefined> => {
		const cache = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
		return cache ? JSON.parse(cache) : undefined;
	},
	removeClient: async () => {
		localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
	},
};

// Налаштування кешування для QueryClient
persistQueryClient({
	queryClient,
	persister: localStoragePersister,
});

const QueryClientWrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		{children}
	</QueryClientProvider>
);

export default QueryClientWrapper;
