// "use client";
// import { ReactNode } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { PersistedClient, Persister } from "@tanstack/react-query-persist-client";
// import { openDB } from "idb";

// // Створення IndexedDB бази даних
// const createIndexedDBPersister = async () => {
// 	const db = await openDB("REACT_QUERY_OFFLINE_CACHE", 1, {
// 		upgrade(db) {
// 			if (!db.objectStoreNames.contains("queries")) {
// 				db.createObjectStore("queries");
// 			}
// 		},
// 	});

// 	return {
// 		persistClient: async (client: PersistedClient) => {
// 			await db.put("queries", client, "state");
// 		},
// 		restoreClient: async (): Promise<PersistedClient | undefined> => {
// 			return (await db.get("queries", "state")) || undefined;
// 		},
// 		removeClient: async () => {
// 			await db.delete("queries", "state");
// 		},
// 	};
// };

// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			gcTime: 1000 * 60 * 60, // Кеш неактивних запитів зберігатиметься 60 хвилин перед видаленням
// 			staleTime: 1000 * 60 * 5, // Час актуальності кешованих даних
// 		},
// 	},
// });

// (async () => {
// 	const indexedDBPersister = await createIndexedDBPersister();
// 	persistQueryClient({
// 		queryClient,
// 		persister: indexedDBPersister,
// 	});
// })();

// const QueryClientWrapper = ({ children }: { children: ReactNode }) => (
// 	<QueryClientProvider client={queryClient}>
// 		{children}
// 	</QueryClientProvider>
// );

// export default QueryClientWrapper;

"use client";
import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { PersistedClient } from "@tanstack/react-query-persist-client";
import { openDB } from "idb";

// Створення IndexedDB Persister
const createIndexedDBPersister = async () => {
	if (typeof window === "undefined" || !window.indexedDB) {
		return null; // IndexedDB недоступний на сервері
	}

	const db = await openDB("REACT_QUERY_OFFLINE_CACHE", 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains("queries")) {
				db.createObjectStore("queries");
			}
		},
	});

	return {
		persistClient: async (client: PersistedClient) => {
			await db.put("queries", client, "state");
		},
		restoreClient: async (): Promise<PersistedClient | undefined> => {
			return (await db.get("queries", "state")) || undefined;
		},
		removeClient: async () => {
			await db.delete("queries", "state");
		},
	};
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60, // 60 хвилин кешування
			staleTime: 1000 * 60 * 5, // 5 хвилин актуальності
		},
	},
});

const QueryClientWrapper = ({ children }: { children: ReactNode }) => {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const initializePersister = async () => {
			const indexedDBPersister = await createIndexedDBPersister();
			if (indexedDBPersister) {
				persistQueryClient({
					queryClient,
					persister: indexedDBPersister,
				});
			}
			setIsInitialized(true);
		};

		initializePersister();
	}, []);

	if (!isInitialized) {
		return null; // Відображення поки не завершена ініціалізація
	}

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

export default QueryClientWrapper;
