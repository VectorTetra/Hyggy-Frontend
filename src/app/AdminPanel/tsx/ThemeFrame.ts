// theme.js
import { createTheme } from '@mui/material/styles';

const themeFrame = createTheme({
	palette: {
		primary: {
			main: '#00AAAD',
			contrastText: '#fff',
		},
		secondary: {
			main: '#be0f0f',
			contrastText: '#fff',
		},
		common: {
			black: '#000',
			white: '#fff',
		},
	},
});

export default themeFrame;
