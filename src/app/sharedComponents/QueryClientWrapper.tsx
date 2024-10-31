// QueryClientWrapper.tsx
"use client";
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const QueryClientWrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		{children}
	</QueryClientProvider>
);

export default QueryClientWrapper;
