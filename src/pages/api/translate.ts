// pages/api/translate.ts

// DeepL API key
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_URL;
if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_URL in your environment variables.");
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_URL in your environment variables.");
}


const API_KEY = process.env.NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_AUTH_KEY;
if (!API_KEY) {
  console.error("API_KEY is not defined. Please set NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_AUTH_KEY in your environment variables.");
  throw new Error("API_KEY is not defined. Please set NEXT_PUBLIC_FRONTEND_API_DEEPL_TRANSLATE_AUTH_KEY in your environment variables.");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, target } = req.body;

  if (!q || !target) {
    return res.status(400).json({ error: "Відсутні обов'язкові параметри" });
  }

  try {
    // Виклик API DeepL для перекладу
    const response = await axios.post(
      API_BASE_URL!,
      new URLSearchParams({
        auth_key: API_KEY!, // ваш API-ключ
        text: q,
        target_lang: target.toUpperCase(), // цільова мова (наприклад, "EN", "DE")
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Отримання перекладеного тексту з відповіді API
    const translatedText = response.data.translations[0].text;

    // Відправка перекладеного тексту на клієнт
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Помилка перекладу:", error);
    return res.status(500).json({ error: "Помилка під час перекладу" });
  }
}
