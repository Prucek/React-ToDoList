import { ReactNode, SetStateAction, useState } from 'react';
import { setDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CirclePicker } from 'react-color';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@mui/material';

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
	const [deadline, setDeadline] = useState(new Date());
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
				deadline: Timestamp.fromDate(deadline),
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
					<TextField label="name" fullWidth {...name.props} />
					<TextField label="description" fullWidth {...description.props} />
					{/*TODO datepicker*/}
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
