import { ReactNode, SetStateAction, useState } from 'react';
import { setDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CirclePicker } from 'react-color';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { tasksDocument } from '../firebase';
import useField from '../hooks/useField';

type Props = {
	children: (open: () => void) => ReactNode;
};

const AddTask = ({ children }: Props) => {
	const user = useLoggedInUser();
	// Open state
	const [open, setOpen] = useState(false);

	// Fields
	const name = useField('name');
	const description = useField('description');
	const [deadline, setDeadline] = useState<Dayjs | null>(dayjs());
	const [duration, setDuration] = useState(10);
	const [color, setColor] = useState('#000000');

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		// setStars(0);
		// description.props.onChange({ target: { value: '' } } as never);
		setSubmitError(undefined);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.email) {
			setSubmitError('not_signed_in');
			return;
		}
		try {
			await setDoc(tasksDocument(uuidv4()), {
				email: user.email,
				name: name.value,
				description: description.value,
				duration,
				deadline: Timestamp.fromDate(deadline ? deadline.toDate() : new Date()),
				status: 'Planned',
				color
			});
			closeDialog();
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : 'unknown_error');
		}
	};

	const handleChangeComplete = (color: { hex: SetStateAction<string> }) => {
		setColor(color.hex);
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>Add task</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: 500
					}}
				>
					<TextField label="Name" fullWidth {...name.props} />
					<TextField label="Description" fullWidth {...description.props} />
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker value={deadline} onChange={date => setDeadline(date)} />
					</LocalizationProvider>

					{/*TODO duration*/}
					<div className="colorPicker">
						<CirclePicker
							color={color}
							onChange={handleChangeComplete}
							onChangeComplete={handleChangeComplete}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					{submitError && (
						<Typography
							variant="subtitle2"
							align="left"
							color="error"
							paragraph
							sx={{ mb: 0, mr: 2 }}
						>
							{submitError}
						</Typography>
					)}
					<Button onClick={closeDialog} variant="outlined">
						Cancel
					</Button>
					<Button onClick={handleSubmit} variant="contained">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddTask;
