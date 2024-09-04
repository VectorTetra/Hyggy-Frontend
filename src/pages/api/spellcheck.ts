// pages/api/spellcheck.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  if (typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  try {
    // Encode the query parameter for URL
    const encodedQuery = encodeURIComponent(query);

    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      `text=${encodedQuery}&language=uk`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    interface Replacement {
      value: string;
    }
    
    interface Match {
      replacements: Replacement[];
    }
    
    const matches = response.data.matches as Match[] || [];
    const suggestions = matches.flatMap(match => match.replacements.map(r => r.value));
    
    const correctedQuery = suggestions.length > 0 ? suggestions : [query];

    return res.status(200).json({ correctedQuery });
  } catch (error) {
    console.error("Error during spell check:", error);
    return res.status(500).json({ error: "Spell check failed" });
  }
}
