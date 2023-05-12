import {
	AppBar,
	Box,
	Button,
	Container,
	CssBaseline,
	FormControlLabel,
	FormGroup,
	PaletteMode,
	Switch,
	ThemeProvider,
	Toolbar,
	responsiveFontSizes,
	createTheme
} from '@mui/material';
import {
	Outlet,
	RootRoute,
	Route,
	Router,
	RouterProvider
} from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { signOut } from './firebase';
import ButtonLink from './components/ButtonLink';
import Home from './pages/Home';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import useLoggedInUser, { UserProvider } from './hooks/useLoggedInUser';
import getPalleteValues from './theme/getPalleteOptions';

const rootRoute = new RootRoute({
	component: () => {
		const user = useLoggedInUser();

		const [mode, setMode] = useState<PaletteMode>('light');

		const toggleColorMode = () => {
			setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
		};

		// Update the theme only if the mode changes
		const theme = useMemo(() => createTheme(getPalleteValues(mode)), [mode]);

		return (
			<ThemeProvider theme={responsiveFontSizes(theme)}>
				<CssBaseline />

				<AppBar sx={{ position: 'sticky' }}>
					<Container maxWidth="sm">
						<Toolbar disableGutters sx={{ gap: 2 }}>
							<ButtonLink to="/">Home</ButtonLink>
							<ButtonLink to="/about">About</ButtonLink>
							<ButtonLink to="/reviews">Reviews</ButtonLink>
							<Box sx={{ flexGrow: 1 }} />
							{!user ? (
								<ButtonLink to="/login">Login</ButtonLink>
							) : (
								<Button onClick={signOut}>Logout</Button>
							)}
							<div />
							<FormGroup>
								<FormControlLabel
									control={<Switch onChange={toggleColorMode} />}
									label="Darkmode"
								/>
							</FormGroup>
						</Toolbar>
					</Container>
				</AppBar>

				<Container
					maxWidth="lg"
					component="main"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						flexGrow: 1,
						gap: 2,
						my: 4
					}}
				>
					<Outlet />
				</Container>
			</ThemeProvider>
		);
	}
});

const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home
});

const aboutRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/about',
	component: About
});

const reviewsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/reviews',
	component: Reviews
});

const loginRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/login',
	component: Login
});

const notFoundRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '*',
	component: NotFound
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	aboutRoute,
	reviewsRoute,
	loginRoute,
	notFoundRoute
]);

const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: typeof router;
	}
}

const App = () => (
	<UserProvider>
		<RouterProvider router={router} />
	</UserProvider>
);

export default App;
