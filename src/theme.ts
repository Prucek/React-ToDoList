import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
	palette: {
		primary: {
			main: '#8c1aff',
			contrastText: '#000000'
		},
		mode: 'dark'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				// Css rule that makes sure app is always 100% height of window
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});

theme = responsiveFontSizes(theme);

export default theme;
