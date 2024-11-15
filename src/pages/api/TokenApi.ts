import { jwtDecode } from "jwt-decode";
import axios from 'axios';
//import { i } from "nuqs/dist/serializer-BZD8Ur_m";
import { toast } from "react-toastify";
//import { ToastContainer, toast, Bounce } from 'react-toastify';
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
	ConfirmPassword: string;
}
class AuthResponseDto {
	isAuthSuccessfull: boolean;
	error: string | null;
	token: string | null;
}

export function validateToken() {
	const token = localStorage.getItem('token');
	if (!token) {
		return { status: 401, message: 'Неавторизований' };
	}

	try {
		const decodedToken = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);

		if (!decodedToken || !decodedToken.exp) {
			return { status: 401, message: 'Ви не авторизовані' };
		}

		console.log('Token expiration date:', new Date(decodedToken.exp * 1000));

		if (decodedToken.exp < currentTime) {
			return { status: 401, message: 'Ваш токен прострочений! ' };
		} else {
			return { status: 200, message: 'Токен дійсний' };
		}
	} catch (error) {
		return { status: 500, message: 'Помилка при обробці токена' };
	}
}

export function removeToken() {
	localStorage.removeItem('token');
}

export function setToken(token: string) {
	localStorage.setItem('token', token);
}

export function getToken() {
	return localStorage.getItem('token');
}

export function getDecodedToken(): JwtPayload | null {
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

export function isAdmin() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'Admin';
}
export function isUser() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'User';
}
export function isStorekeeper() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'Storekeeper';
}
export function isOwner() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'Owner';
}
export function isGeneralAccountant() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'General Accountant';
}
export function isAccountant() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'Accountant';
}
export function isSaler() {
	const token = getDecodedToken();
	if (!token || !token.role) {
		return false;
	}

	return token.role === 'Saler';
}

export async function Authorize(params: UserForAuthenticationDto) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/shopemployee/authenticate', params);

		if (response.data.isAuthSuccessfull) {
			setToken(response.data.token);
		} else {
			removeToken();
			toast.error(response.data.error);
		}
		return response.data;

	} catch (error) {
		removeToken();
		//console.error('Error authorizing:', error);
		// Перевіряємо, чи є в error.response об'єкт, який містить помилку сервера
		if (error.response && error.response.data) {
			toast.error('Помилка авторизації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка авторизації');
		}
	}
}
export async function RegisterAsWorker(params: UserForRegistrationDto) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/shopemployee/register', params);

		if (response.data.message) {
			toast.info(response.data.message, { autoClose: false, closeOnClick: true });
		} else {
		}
		//return response.data;

	} catch (error) {
		//console.error('Error authorizing:', error);
		// Перевіряємо, чи є в error.response об'єкт, який містить помилку сервера
		if (error.response && error.response.data) {
			toast.error('Помилка реєстрації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка реєстрації');
		}
	}
}
export async function RegisterAsClient(params: UserForRegistrationDto) {
	try {
		console.log(params);
		const response = await axios.post('http://www.hyggy.somee.com/api/Customer/register', params);
		console.log(response);
		if (response.data.message) {
			toast.info(response.data.message, { autoClose: false, closeOnClick: true });
		} else {
		}
		//return response.data;

	} catch (error) {
		//console.error('Error authorizing:', error);
		// Перевіряємо, чи є в error.response об'єкт, який містить помилку сервера
		console.log(error);
		if (error.response && error.response.data) {
			toast.error('Помилка реєстрації: ' + error.response.data);
		} else {
			toast.error('Невідома помилка реєстрації');
		}
	}
}


