import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function ConfirmationDialog({
	open,
	title,
	contentText,
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
				<Button onClick={onCancel} color="primary">
					{cancelButtonText}
				</Button>
				<Button onClick={onConfirm} color="secondary" autoFocus>
					{confirmButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
