import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export class WareImageQueryParams {
    SearchParameter: string = "Query";
    Id?: number | null;
    Path?: string | null;
    WareId?: number | null;
    WareArticle?: number | null;
    PageNumber?: number | null;
    PageSize?: number | null;
    Sorting?: string | null;
    StringIds?: string | null;
    QueryAny?: string | null;
}

export class WareImagePostDTO {
    Path: string;
    WareId: number;
}
export class WareImagePutDTO {
    Id: number;
    Path: string;
    WareId: number;
}

export class WareImage {
    id: number;
    path: string;
    wareId: number;
    stringIds: string;
}

export async function getWareImages(params: WareImageQueryParams = { SearchParameter: "Query" }) {
    try {
        const response = await axios.get('http://www.hyggy.somee.com/api/WareImage', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching WareImages:', error);
        throw new Error('Failed to fetch WareImages');
    }
}

// POST запит для створення нового складу
export async function postWareImage(WareImage: WareImagePostDTO) {
    try {
        const response = await axios.post('http://www.hyggy.somee.com/api/WareImage', WareImage);
        return response.data;
    } catch (error) {
        console.error('Error creating WareImage:', error);
        throw new Error('Failed to create WareImage');
    }
}

// PUT запит для оновлення існуючого складу
export async function putWareImage(WareImage: WareImagePutDTO) {
    try {
        if (!WareImage.Id) {
            throw new Error('Id is required for updating a WareImage');
        }

        const response = await axios.put(`http://www.hyggy.somee.com/api/WareImage`, WareImage);
        return response.data;
    } catch (error) {
        console.error('Error updating WareImage:', error);
        throw new Error('Failed to update WareImage');
    }
}

// DELETE запит для видалення складу за Id
export async function deleteWareImage(id: number) {
    try {
        const response = await axios.delete(`http://www.hyggy.somee.com/api/WareImage/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Ware:', error);
        throw new Error('Failed to delete Ware');
    }
}
