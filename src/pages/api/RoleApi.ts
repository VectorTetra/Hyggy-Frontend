import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export class Role {
	id: string;
	name: string;
	normalizedName?: string;
	concurrencyStamp?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ROLE;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ROLE in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ROLE in your environment variables.");
}

// GET all roles
export async function getRoles() {
	try {
		const response = await axios.get(`${API_BASE_URL}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching Roles:', error);
		throw new Error('Failed to fetch Roles');
	}
}

// GET all roles except by RoleIds
export async function getAllRolesExceptByRoleIds(roleIds: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/exceptByRoleId`, {
			params: { roleIds },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Roles:', error);
		throw new Error('Failed to fetch Roles');
	}
}

// GET all roles except by RoleNames
export async function getAllRolesExceptByRoleNames(roleNames: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/exceptByRoleName`, {
			params: { roleNames },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Roles:', error);
		throw new Error('Failed to fetch Roles');
	}
}

// GET role by Id
export async function getRoleById(id: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/byRoleId`, {
			params: { id },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Role by Id:', error);
		throw new Error('Failed to fetch Role by Id');
	}
}
// GET role by roleName
export async function getRoleByName(roleName: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/byRoleName`, {
			params: { roleName },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Role by Name:', error);
		throw new Error('Failed to fetch Role by Id');
	}
}
// GET role by roleNames
export async function getRolesByNames(roleNames: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/byRoleNames`, {
			params: { roleNames },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Roles by Names:', error);
		throw new Error('Failed to fetch Role by Id');
	}
}

// Hooks for caching responses using react-query

export function useRoles(isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['roles'],
		queryFn: () => getRoles(),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}

export function useRolesExceptByRoleIds(roleIds: string, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['roles', 'exceptByRoleIds', roleIds],
		queryFn: () => getAllRolesExceptByRoleIds(roleIds),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}

export function useRolesExceptByRoleNames(roleNames: string, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['roles', 'exceptByRoleNames', roleNames],
		queryFn: () => getAllRolesExceptByRoleNames(roleNames),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}

export function useRoleById(id: string, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['role', id],
		queryFn: () => getRoleById(id),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}

export function useRoleByName(roleName: string, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['role', roleName],
		queryFn: () => getRoleByName(roleName),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}

export function useRolesByNames(roleNames: string, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['roles', roleNames],
		queryFn: () => getRolesByNames(roleNames),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: isEnabled,
	});
}
