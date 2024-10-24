import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function ConfirmationDialog({
	open,
	title,
	contentText,
	confirmButtonColor = "#248922",
	cancelButtonColor = "#be0f0f",
	onConfirm,
	onCancel = () => { }, // За замовчуванням виконується порожня функція
	confirmButtonText = "Підтвердити",
	cancelButtonText = "Скасувати"
}) {
	return (
		<Dialog
			open={open}
			onClose={onCancel} // Використовуємо onCancel для закриття діалогу за замовчуванням
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{contentText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} variant="contained" sx={{ backgroundColor: cancelButtonColor }} >
					{cancelButtonText}
				</Button>
				<Button onClick={onConfirm} variant="contained" sx={{ backgroundColor: confirmButtonColor }} autoFocus>
					{confirmButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
