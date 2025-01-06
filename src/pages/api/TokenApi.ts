import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

class JwtPayload {
	nameid: string;
	email: string;
	given_name: string;
	role: string;
	nbf: number;
	exp: number;
	iat: number;
	iss: string;
	aud: string;
	shopId?: string | null; // ID магазину (додатковий клейм)
	storageId?: string | null; // ID складу (додатковий клейм)
}

class UserForAuthenticationDto {
	Email: string;
	Password: string;
}

class UserForRegistrationDto {
	Name: string;
	Surname: string;
	Email: string;
	Role: string;
	Password: string;
	ShopId?: string | null;
	StorageId?: string | null;
	ConfirmPassword: string;
}

class AuthResponseDto {
	isAuthSuccessfull: boolean;
	error: string | null;
	token: string | null;
}


const API_ACCOUNT_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT;
if (!API_ACCOUNT_URL) {
	console.error("API_ACCOUNT_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT in your environment variables.");
	throw new Error("API_ACCOUNT_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT in your environment variables.");
}
const API_SHOPEMPLOYEE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE;
if (!API_SHOPEMPLOYEE_URL) {
	console.error("API_SHOPEMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE in your environment variables.");
	throw new Error("API_SHOPEMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP_EMPLOYEE in your environment variables.");
}
const API_STORAGEEMPLOYEE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE;
if (!API_STORAGEEMPLOYEE_URL) {
	console.error("API_STORAGEEMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE in your environment variables.");
	throw new Error("API_STORAGEEMPLOYEE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE_EMPLOYEE in your environment variables.");
}
const API_CUSTOMER_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER;
if (!API_CUSTOMER_URL) {
	console.error("API_CUSTOMER_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER in your environment variables.");
	throw new Error("API_CUSTOMER_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_CUSTOMER in your environment variables.");
}

/** Перевіряємо, чи ми в браузері */
function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

export function validateToken() {
	if (!isBrowser()) {
		return { status: 401, message: 'Токен недоступний на сервері' };
	}

	const token = localStorage.getItem('token');
	if (!token) {
		return { status: 401, message: 'Неавторизований' };
	}

	try {
		const decodedToken = jwtDecode<JwtPayload>(token);
		const currentTime = Math.floor(Date.now() / 1000);

		if (!decodedToken || !decodedToken.exp) {
			return { status: 401, message: 'Ви не авторизовані' };
		}

		if (decodedToken.exp < currentTime) {
			return { status: 401, message: 'Ваш токен прострочений!' };
		} else {
			return { status: 200, message: 'Токен дійсний' };
		}
	} catch (error) {
		return { status: 500, message: 'Помилка при обробці токена' };
	}
}

export function isTokenValid(): boolean {
	return validateToken().status === 200;
}

export function removeToken() {
	if (isBrowser()) {
		localStorage.removeItem('token');
	}
}

export function setToken(token: string) {
	if (isBrowser()) {
		localStorage.setItem('token', token);
	}
}

export function getToken(): string | null {
	if (isBrowser()) {
		return localStorage.getItem('token');
	}
	return null;
}

export function getDecodedToken(): JwtPayload | null {
	if (!isBrowser()) {
		return null;
	}

	const token = getToken();
	if (!token) {
		return null;
	}
	if (validateToken().status !== 200) {
		removeToken();
		return null;
	}

	return jwtDecode<JwtPayload>(token);
}

export function checkRole(role: string): boolean {
	const token = getDecodedToken();
	return token?.role === role && validateToken().status === 200;
}

export function isAdmin() {
	return checkRole('Admin');
}

export function isUser() {
	return checkRole('User');
}
export function isGuest() {
	return getDecodedToken() === null;
}

export function isStorekeeper() {
	return checkRole('Storekeeper');
}

export function isOwner() {
	return checkRole('Owner');
}

export function isGeneralAccountant() {
	return checkRole('General Accountant');
}

export function isAccountant() {
	return checkRole('Accountant');
}

export function isSaler() {
	return checkRole('Saler');
}

export async function Authorize(params: UserForAuthenticationDto) {
	try {
		const response = await axios.post(`${API_ACCOUNT_URL!}/authenticate`, params);
		if (response.data.isAuthSuccessfull) {
			setToken(response.data.token);
		} else {
			removeToken();
			toast.error(response.data.error);
		}
		return response.data;

	} catch (error) {
		removeToken();
		if (error.response && error.response.data) {
			toast.error('Помилка авторизації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка авторизації');
		}
	}
}

export async function RegisterAsShopEmployee(params: UserForRegistrationDto) {
	try {
		const response = await axios.post(`${API_SHOPEMPLOYEE_URL!}/register`, params);

		if (response.data.message) {
			toast.info(response.data.message, { autoClose: false, closeOnClick: true });
		}

	} catch (error) {
		if (error.response && error.response.data) {
			toast.error('Помилка реєстрації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка реєстрації');
		}
	}
}

export async function RegisterAsStorageEmployee(params: UserForRegistrationDto) {
	try {
		const response = await axios.post(`${API_STORAGEEMPLOYEE_URL!}/register`, params);

		if (response.data.message) {
			toast.info(response.data.message, { autoClose: false, closeOnClick: true });
		}

	} catch (error) {
		if (error.response && error.response.data) {
			toast.error('Помилка реєстрації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка реєстрації');
		}
	}
}

export async function RegisterAsClient(params: UserForRegistrationDto) {
	try {
		const response = await axios.post(`${API_CUSTOMER_URL!}/register`, params);
		if (response.data.message) {
			toast.info(response.data.message, { autoClose: false, closeOnClick: true });
		}

	} catch (error) {
		if (error.response && error.response.data) {
			toast.error('Помилка реєстрації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка реєстрації');
		}
	}
}

export const getRolePermissions = () => {
	// Кешування результатів перевірки ролей
	const roleCheckCache = {
		IsOwner: isOwner(),
		IsAdmin: isAdmin(),
		IsAccountant: isAccountant(),
		IsGeneralAccountant: isGeneralAccountant(),
		IsSaler: isSaler(),
		IsStorekeeper: isStorekeeper(),
	};
	// Спрощений доступ до кешу
	const { IsOwner, IsAdmin, IsAccountant, IsGeneralAccountant, IsSaler, IsStorekeeper } = roleCheckCache;

	// Ролі в ієрархії магазину від найвищого до найнижчого
	const roleHierarchy = [
		"Owner",
		"General Accountant",
		"Admin",
		"Accountant",
		"Saler",
	];



	return {
		// Ролі
		...roleCheckCache,
		selfEmployeeId: getDecodedToken()?.nameid,

		canEditSelf(currentUserId) {
			return currentUserId === this.selfEmployeeId;
		},

		canEditEmployeeAsAdmin(targetUserStorageId, targetUserRole) {
			if (!IsAdmin) return false;
			const isShopRelatedRole = ["Saler", "Storekeeper", "General Accountant", "Saler", "Accountant"].includes(targetUserRole);
			return isShopRelatedRole && getDecodedToken()?.storageId == targetUserStorageId.toString();
		},
		canEditShopAsOwnerOrAdmin(targetShopStorageId) {
			if (IsOwner) return true;
			if (!IsAdmin) return false;
			return getDecodedToken()?.storageId == targetShopStorageId.toString();
		},

		canDeleteEmployeeAsAdmin(targetUserStorageId, targetUserRole) {
			if (!IsAdmin) return false;
			const isShopRelatedRole = ["Saler", "Storekeeper", "General Accountant", "Saler", "Accountant"].includes(targetUserRole);
			return isShopRelatedRole && getDecodedToken()?.storageId == targetUserStorageId.toString();
		},

		canEditAnyEmployee: () => IsOwner,
		canDeleteAnyEmployee: () => IsOwner,
		canReadStorageStoresSum(targetStorageId) {
			if (IsOwner || IsGeneralAccountant) return true;
			if (IsAdmin || IsAccountant) return getDecodedToken()?.storageId == targetStorageId.toString();
			else return false;
		},
		canReadShopExecutedOrdersSum(targetStorageId) {
			if (IsOwner || IsGeneralAccountant) return true;
			if (IsAdmin || IsAccountant) return getDecodedToken()?.storageId == targetStorageId.toString();
			return false;
		},

		getAvailableRolesForShopFrame(targetUserId) {
			// Якщо редагує сам себе
			if (this.selfEmployeeId === targetUserId) {
				if (IsOwner) {
					return roleHierarchy.join("|"); // Власник може вибирати собі будь-яку роль
				}
				if (IsAdmin) {
					return "Admin"	 // Адмін може вибирати тільки Admin
				}
				// Всі інші не можуть редагувати ролі
				return getDecodedToken()?.role;
			}
			// Якщо редагує іншого
			if (IsOwner) {
				return roleHierarchy.join("|");; // Власник може вибирати будь-яку роль
			}

			if (IsAdmin) {
				return roleHierarchy.slice(3).join("|"); // Адмін може вибирати ролі нижчі за Admin
			}
			// Всі інші не можуть редагувати ролі
			return null;
		},

		getAvailableRolesForStorageFrame() {
			return "Storekeeper";
		},
		// Чи доступні фрейми взагалі
		IsAdminPanelContent_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,

		// Фрейм "Товари"
		IsFrameWare_Available: IsOwner || IsAdmin || IsSaler || IsStorekeeper || IsAccountant || IsGeneralAccountant,
		IsFrameWareAddEdit_Available: IsOwner,
		IsFrameWare_Button_AddWare_Available: IsOwner,
		IsFrameWare_Button_EditWare_Available: IsOwner,
		IsFrameWare_Button_DeleteWare_Available: IsOwner,

		// Фрейм "Склади"
		IsTabStorage_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsStorekeeper || IsSaler,
		IsFrameStorage_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsStorekeeper || IsSaler,
		IsFrameStorageAddEdit_Available: IsOwner,
		IsFrameStorage_Cell_StoresSum_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant,
		IsFrameStorage_Cell_Actions_Available: IsOwner,
		IsFrameStorage_Button_AddStorage_Available: IsOwner,
		IsFrameStorage_Button_EditStorage_Available: IsOwner,
		IsFrameStorage_Button_DeleteStorage_Available: IsOwner,

		// Фрейм "Залишки"
		IsFrameRemaining_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,

		// Фрейм "Поставки"
		IsFrameSupply_Available: IsOwner || IsAdmin || IsStorekeeper,

		// Фрейм "Переміщення"
		IsFrameTransfer_Available: IsOwner || IsAdmin || IsStorekeeper,

		// Фрейм "Списання"
		IsFrameWriteoff_Available: IsOwner || IsAdmin || IsStorekeeper,

		// Фрейм "Блог"
		IsFrameBlog_Available: IsOwner || IsAdmin,
		IsFrameBlog_Cell_Actions_Available: IsOwner || IsAdmin,
		IsFrameBlog_Button_AddBlog_Available: IsOwner || IsAdmin,
		IsFrameBlog_Button_EditBlog_Available: IsOwner || IsAdmin,
		IsFrameBlog_Button_DeleteBlog_Available: IsOwner || IsAdmin,

		// Фрейм "Клієнти"
		IsFrameClients_Available: IsOwner || IsAdmin || IsSaler,
		IsFrameClients_Cell_ExecutedOrdersSum_Available: IsOwner,
		IsFrameClients_Cell_ExecutedOrdersAvg_Available: IsOwner,
		IsFrameClients_Cell_Actions_Available: IsOwner,
		IsFrameClients_Button_DeleteClient_Available: IsOwner,

		// Фрейм "Замовлення"
		IsFrameOrders_Available: IsOwner || IsAdmin || IsSaler,

		// Фрейм "Магазини"
		IsFrameShops_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,
		IsFrameShopAddEdit_Available: IsOwner || IsAdmin,
		IsFrameShops_Button_AddShop_Available: IsOwner,
		IsFrameShops_Cell_ExecutedOrdersSum_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant,
		IsFrameShops_Cell_Actions_Available: IsOwner || IsAdmin,
		IsFrameShops_Button_EditShop_Available: IsOwner || IsAdmin, // Admin - canEditShopAsAdmin()
		IsFrameShops_Button_DeleteShop_Available: IsOwner,

		IsTabEmployees_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,

		// Фрейм "Співробітники магазину"
		IsFrameShopEmployees_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,
		IsFrameShopEmployees_Button_AddShopEmployee_Available: IsOwner || IsAdmin,
		IsFrameShopEmployees_Button_EditShopEmployee_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler,
		IsFrameShopEmployees_Button_DeleteShopEmployee_Available: IsOwner || IsAdmin,

		// Фрейм "Співробітники складу"
		IsFrameStorageEmployees_Available: IsOwner || IsAdmin || IsStorekeeper,
		IsFrameStorageEmployees_Button_AddStorageEmployee_Available: IsOwner || IsAdmin,
		IsFrameStorageEmployees_Button_EditStorageEmployee_Available: IsOwner || IsAdmin || IsStorekeeper,
		IsFrameStorageEmployees_Button_DeleteStorageEmployee_Available: IsOwner || IsAdmin,

		// Фрейм "Відгуки"
		//IsFrameReviews_Available: IsOwner || IsAdmin || IsAccountant || IsGeneralAccountant || IsSaler || IsStorekeeper,
	};
};
