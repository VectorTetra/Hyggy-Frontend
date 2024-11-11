// pages/api/region.ts

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, long, maxDistance } = req.query;

    if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const url = `https://www.ukrposhta.ua/address-classifier-ws/get_postoffices_by_geolocation?lat=${lat}&long=${long}&maxdistance=${maxDistance}`;
    const headers = {
        Authorization: 'Bearer f9027fbb-cf33-3e11-84bb-5484491e2c94',
        Accept: 'application/json',
    };

    try {
        const response = await axios.get(url, { headers });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}
