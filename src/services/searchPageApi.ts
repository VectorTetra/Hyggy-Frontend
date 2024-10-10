import axios from "axios";
export async function translateText(text: string, targetLang: string) {
	const response = await axios.post(
		"/api/translate",
		{
			q: text,
			source: "auto",
			target: targetLang,
			format: "text",
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return response.data.translatedText;
}

export async function spellCheck(query: string) {
	const response = await axios.get("/api/spellcheck", { params: { query } });
	return response.data.correctedQuery;
}