import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const NotFound = () => (
	<>
		<WarningIcon sx={{ typography: 'h1' }} />
		<Typography variant="h2">Not_found</Typography>
		<Typography>Not_found_text</Typography>
	</>
);

export default NotFound;
