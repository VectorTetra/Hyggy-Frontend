import axios from 'axios';

const API_RESETPASSWORD_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_RESETPASSWORD;
if (!API_RESETPASSWORD_URL) {
    console.error("API_RESETPASSWORD_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_RESETPASSWORD in your environment variables.");
    throw new Error("API_RESETPASSWORD_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_RESETPASSWORD in your environment variables.");
}

const API_FORGOTPASSWORD_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_FORGOTPASSWORD;
if (!API_FORGOTPASSWORD_URL) {
    console.error("API_FORGOTPASSWORD_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_FORGOTPASSWORD in your environment variables.");
    throw new Error("API_FORGOTPASSWORD_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ACCOUNT_FORGOTPASSWORD in your environment variables.");
}

export default async function forgotPassword(Email: string) {
    try {
        const response = await axios.post(API_FORGOTPASSWORD_URL!, { Email });
        return response.data;
    } catch (error) {
        console.error('Error reset password:', error);
        throw new Error('Failed to reset password');
    }
}

export async function resetPassword(Password: string, ConfirmPassword: string, Email: string, Token: string) {
    try {
        const response = await axios.post(API_RESETPASSWORD_URL!, { Password, ConfirmPassword, Email, Token });
        return response.data;
    } catch (error) {
        console.error('Error reset password:', error);
        throw new Error('Failed to reset password');
    }
}