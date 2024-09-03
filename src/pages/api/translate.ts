// pages/api/translate.ts

// DeepL API key
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, target } = req.body;

  if (!q || !target) {
    return res.status(400).json({ error: "Відсутні обов'язкові параметри" });
  }

  try {
    // Виклик API DeepL для перекладу
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        auth_key: "7b31f3b0-bc70-4e3d-9b64-c4211bb40b86:fx", // ваш API-ключ
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
