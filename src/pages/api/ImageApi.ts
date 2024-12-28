import axios from 'axios';

// Тип для відповіді від сервера при завантаженні зображень
export interface UploadResponse {
    url: string;
}

// Тип для параметрів запиту на отримання фото та видалення за URL
export interface GetPhotoByUrlParams {
    url: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_IMAGE;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_IMAGE in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_IMAGE in your environment variables.");
}
// POST запит для завантаження фото
export async function uploadPhotos(files: FileList): Promise<string[]> {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }

        const response = await axios.post<string[]>(`${API_BASE_URL!}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading photos:', error);
        throw error;
    }
}

// POST запит для отримання фото за URL та його видалення
export async function getPhotoByUrlAndDelete(url: string) {
    try {
        const response = await axios.get(`${API_BASE_URL!}/getphotobyurlAndDelete`, {
            params: { url }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching and deleting photo by URL:', error);
        throw error;
    }
}

// DELETE запит для видалення фото за Id
export async function deletePhoto(id: string) {
    try {
        const response = await axios.delete(`${API_BASE_URL!}/deletephoto`, {
            params: { id }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
}
