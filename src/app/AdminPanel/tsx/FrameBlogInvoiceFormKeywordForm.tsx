import CrossIcon from '@/app/sharedComponents/CrossIcon';
import useBlogInvoiceStore from '@/store/BlogInvoiceStore';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import styles from '@/app/AdminPanel/css/FrameBlogInvoiceFormKeywordForm.module.css';
const FrameBlogInvoiceFormKeywordForm = () => {
	const [newKeyword, setNewKeyword] = useState('');
	const {
		keywords,
		addKeyword,
		removeKeyword,
		clearKeywords,
	} = useBlogInvoiceStore();

	return (
		<div style={{ marginBottom: '2rem' }}>
			<h4>Ключові слова</h4>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
				{keywords.map((keyword, index) => (
					<span key={index} className={styles.keywordStickerItem} onClick={() => removeKeyword(index)}>
						<div className={styles.text}>{keyword}</div> {/* Відображаємо name */}
						<CrossIcon width="22px" height="22px" />
					</span>
				))}
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<TextField
					variant="outlined"
					placeholder="Введіть ключове слово"
					value={newKeyword}
					onChange={(e) => setNewKeyword(e.target.value)}
					fullWidth
					sx={{ marginRight: '10px' }}
				/>
				<Button variant="contained" color="primary"
					onClick={() => {
						addKeyword(newKeyword);
						setNewKeyword('');
					}}>
					Додати
				</Button>
			</Box>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button variant="contained" sx={{ backgroundColor: "#be0f0f" }} onClick={clearKeywords}>
					Прибрати всі ключові слова
				</Button>
			</Box>
		</div>
	);
};

export default FrameBlogInvoiceFormKeywordForm;

