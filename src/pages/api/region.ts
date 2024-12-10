// pages/api/region.ts

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_GET_BY_GEOLOCATION;
if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_GET_BY_GEOLOCATION in your environment variables.");
    throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_GET_BY_GEOLOCATION in your environment variables.");
}
const API_TOKEN = process.env.NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_BEARER_TOKEN;
if (!API_TOKEN) {
    console.error("API_TOKEN is not defined. Please set NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_BEARER_TOKEN in your environment variables.");
    throw new Error("API_TOKEN is not defined. Please set NEXT_PUBLIC_FRONTEND_API_UKRPOSHTA_BEARER_TOKEN in your environment variables.");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, long, maxDistance } = req.query;

    if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const url = `${API_BASE_URL!}?lat=${lat}&long=${long}&maxdistance=${maxDistance}`;
    const headers = {
        Authorization: API_TOKEN!,
        Accept: 'application/json',
    };

    try {
        const response = await axios.get(url, { headers });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
}
