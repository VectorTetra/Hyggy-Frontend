// /pages/api/postoffice.js

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { street_ua } = req.query;

    if (typeof street_ua !== "string") {
        return res.status(400).json({ error: "Invalid postal code" });
    }

    const url = `https://www.ukrposhta.ua/address-classifier-ws/get_street_by_region_id_and_district_id_and_city_id_and_street_ua?street_ua=${street_ua}`;
    const headers = {
        Authorization: "Bearer f9027fbb-cf33-3e11-84bb-5484491e2c94",
        Accept: "application/json",
    };

    try {
        const response = await axios.get(url, { headers });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Помилка сервера" });
    }
}
