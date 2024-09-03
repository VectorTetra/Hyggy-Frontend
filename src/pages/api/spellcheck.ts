// pages/api/spellcheck.ts
import Typo from "typo-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  if (typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  const typo = new Typo("en_US");
  const suggestions = typo.suggest(query);
  const correctedQuery = suggestions[0] || query;

  return res.status(200).json({ correctedQuery });
}
