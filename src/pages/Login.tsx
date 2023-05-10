import { useNavigate } from '@tanstack/react-router';
import { FormEvent, useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import useField from '../hooks/useField';
import { signIn, signUp } from '../firebase';

const Login = () => {
	usePageTitle('login');

	const navigate = useNavigate();

	const [isSignUp, setSignUp] = useState(false);

	const email = useField('email', true);
	const password = useField('password', true);

	const [submitError, setSubmitError] = useState<string>();

	return (
		<Paper
			component="form"
			onSubmit={async (e: FormEvent) => {
				e.preventDefault();
				try {
					isSignUp
						? await signUp(email.value, password.value)
						: await signIn(email.value, password.value);
					navigate({ to: '/' });
				} catch (err) {
					setSubmitError(
						(err as { message?: string })?.message ?? 'unknown_error'
					);
				}
			}}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				p: 4,
				gap: 2
			}}
		>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				Login
			</Typography>
			<TextField label="email" {...email.props} type="email" />
			<TextField label="password" {...password.props} type="password" />
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					alignItems: 'center',
					alignSelf: 'flex-end',
					mt: 2
				}}
			>
				{submitError && (
					<Typography
						variant="caption"
						textAlign="right"
						sx={{ color: 'error.main' }}
					>
						{submitError}
					</Typography>
				)}
				<Button
					type="submit"
					variant="outlined"
					onClick={() => setSignUp(true)}
				>
					sign_up
				</Button>
				<Button
					type="submit"
					variant="contained"
					onClick={() => setSignUp(false)}
				>
					sign_in
				</Button>
			</Box>
		</Paper>
	);
};

export default Login;