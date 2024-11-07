// /pages/api/postoffice/region.js

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { region_id } = req.query;

    if (typeof region_id !== "string") {
        return res.status(400).json({ error: "Invalid region ID" });
    }

    const url = `https://www.ukrposhta.ua/address-classifier-ws/get_postoffices_by_city_id?region_id=${region_id}`;
    const headers = {
        Authorization: "Bearer f9027fbb-cf33-3e11-84bb-5484491e2c94",
        Accept: "application/json",
    };

    try {
        const response = await axios.get(url, { headers });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
}
