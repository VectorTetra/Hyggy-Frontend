import axios from 'axios';

export default async function forgotPassword(Email: string) {
    try {
        const response = await axios.post('http://www.hyggy.somee.com/api/account/forgotpassword', { Email });
        //const response = await axios.post('http://localhost:5263/api/account/forgotpassword', { Email });
        return response.data;
    } catch (error) {
        console.error('Error reset password:', error);
        throw new Error('Failed to reset password');
    }
}

export async function resetPassword(Password: string, ConfirmPassword: string, Email: string, Token: string) {
    try {
        const response = await axios.post('http://www.hyggy.somee.com/api/account/resetpassword', { Password, ConfirmPassword, Email, Token });
        //const response = await axios.post('http://localhost:5263/api/account/resetpassword', { Password, ConfirmPassword, Email, Token });
        return response.data;
    } catch (error) {
        console.error('Error reset password:', error);
        throw new Error('Failed to reset password');
    }
}