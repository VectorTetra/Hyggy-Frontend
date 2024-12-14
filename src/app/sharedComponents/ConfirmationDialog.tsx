import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, createTheme, ThemeProvider } from '@mui/material';


// Створюємо тему для відображення діалогу
type VariantType = "contained" | "outlined" | "text"; // Визначаємо допустимі значення для варіантів кнопок

interface ConfirmationDialogProps {
	open: boolean;
	title: string;
	contentText: React.ReactNode;
	confirmButtonBackgroundColor?: string;
	confirmButtonBorderColor?: string;
	confirmButtonColor?: string;
	confirmButtonVariant?: VariantType; // Використовуємо допустимі значення
	cancelButtonBackgroundColor?: string;
	cancelButtonBorderColor?: string;
	cancelButtonColor?: string;
	cancelButtonVariant?: VariantType; // Використовуємо допустимі значення
	onConfirm: () => void;
	onCancel?: () => void;
	confirmButtonText?: string;
	cancelButtonText?: string;
}

export default function ConfirmationDialog({
	open,
	title,
	contentText,
	confirmButtonBackgroundColor = "#248922",
	confirmButtonBorderColor = "#248922",
	confirmButtonColor = "#248922",
	confirmButtonVariant = "contained", // Значення за замовчуванням
	cancelButtonBackgroundColor = "#ffffff",
	cancelButtonBorderColor = "#be0f0f",
	cancelButtonColor = "#be0f0f",
	cancelButtonVariant = "outlined", // Значення за замовчуванням
	onConfirm,
	onCancel = () => { },
	confirmButtonText = "Підтвердити",
	cancelButtonText = "Скасувати"
}: ConfirmationDialogProps) {

	const theme = createTheme({
		palette: {
			primary: {
				main: `${cancelButtonColor}`,
				contrastText: '#fff',
			},
			secondary: {
				main: `${confirmButtonColor} !important`,
				contrastText: '#fff',
			}
		},
	});
	return (
		<ThemeProvider theme={theme}>
			<Dialog
				open={open}
				onClose={onCancel}
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
					<Button
						onClick={onCancel}
						variant={cancelButtonVariant}
						sx={{
							backgroundColor: `${cancelButtonBackgroundColor} !important`,
							borderColor: `${cancelButtonBorderColor} !important`,
							//color: `${cancelButtonColor} !important !important`,
						}}
					>
						{cancelButtonText}
					</Button>
					<Button
						autoFocus
						onClick={onConfirm}
						variant={confirmButtonVariant} // Застосовуємо передане або значення за замовчуванням
						sx={{
							backgroundColor: confirmButtonBackgroundColor,
							borderColor: confirmButtonBorderColor,
							//color: confirmButtonColor,
						}}
					>
						{confirmButtonText}
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
