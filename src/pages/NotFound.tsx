import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import usePageTitle from '../hooks/usePageTitle';

const NotFound = () => {
	usePageTitle('not_found');
	return (
		<>
			<WarningIcon sx={{ typography: 'h1' }} />
			<Typography variant="h2">Not_found</Typography>
			<Typography>You requested not existing page !!!</Typography>
		</>
	);
};

export default NotFound;
