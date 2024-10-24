import axios from 'axios';

// Тип для відповіді від сервера при завантаженні зображень
export interface UploadResponse {
    url: string;
}

// Тип для параметрів запиту на отримання фото та видалення за URL
export interface GetPhotoByUrlParams {
    url: string;
}

// POST запит для завантаження фото
export async function uploadPhotos(files: FileList): Promise<string[]> {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }

        const response = await axios.post<string[]>("http://www.hyggy.somee.com/api/Image/upload", formData, {
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
        const response = await axios.get(`http://www.hyggy.somee.com/api/Image/getphotobyurlAndDelete`, {
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
        const response = await axios.delete(`http://www.hyggy.somee.com/api/Image/deletephoto`, {
            params: { id }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
}
