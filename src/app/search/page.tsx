"use client";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import axios from "axios";
import jsonWares from "./wares.json";
import TabBar from "./tsx/TabBar";

async function translateText(text:string, targetLang:string) {
	const response = await axios.post('https://libretranslate.de/translate', {
	  q: text,
	  source: 'auto', // Автоматичне визначення мови
	  target: targetLang,
	  format: 'text'
	}, {
	  headers: {
		'Content-Type': 'application/json'
	  }
	});
  
	return response.data.translatedText;
  }
  
export async function handler(req: any, res:any) {
	const { text, targetLang } = req.query;
	try {
	  const translatedText = await translateText(text, targetLang);
	  res.status(200).json({ translatedText });
	} catch (error) {
	  res.status(500).json({ error: 'Translation failed' });
	}
  }
export default function SearchPage() {

  
	return (
	  <Layout headerType="header1" footerType = 'footer1'>
		<div className={styles.main}>
		  <TabBar waresQuantity={jsonWares.length} pagesQuantity={1} />

		</div>
	  </Layout>
	);
  }