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
	FormControl,
	InputLabel,
	MenuItem,
	Select,
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
	const name = useField('name', true);
	const description = useField('description');
	const [deadline, setDeadline] = useState<Dayjs | null>(dayjs());
	const [duration, setDuration] = useState(10);
	const [unit, setUnit] = useState('mins');
	const units = ['mins', 'hours', 'days'];
	const [color, setColor] = useState('#FFFFFF');

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		name.props.onChange({ target: { value: '' } } as never);
		description.props.onChange({ target: { value: '' } } as never);
		setDeadline(dayjs());
		setDuration(10);
		setUnit('mins');
		setColor('#FFFFFF');
		setSubmitError(undefined);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.email) {
			setSubmitError('not_signed_in');
			return;
		}
		if (!name.value) {
			setSubmitError('name_required');
			return;
		}
		try {
			const id = uuidv4();
			await setDoc(tasksDocument(id), {
				id,
				email: user.email,
				name: name.value,
				description: description.value,
				duration:
					duration * (unit === 'mins' ? 1 : unit === 'hours' ? 60 : 60 * 24),
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

	const handleNumberChange = (event: { target: { value: string } }) => {
		const re = /^[0-9\b]+$/;
		if (event.target.value === '' || re.test(event.target.value)) {
			setDuration(+event.target.value);
		}
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

					<div className="flex flex-row w-full">
						<TextField
							label="Duration"
							sx={{
								width: '75%'
							}}
							type="number"
							value={duration}
							onChange={handleNumberChange}
						/>
						<FormControl sx={{ width: '25%' }}>
							<InputLabel id="unit-select-label">Unit</InputLabel>
							<Select
								labelId="unit-select-label"
								id="unit-select"
								value={unit}
								defaultValue="mins"
								label="Units"
								onChange={event => {
									setUnit(event.target.value);
								}}
								sx={{
									fontSize: '1rem',
									fontStyle: 'italic',
									textTransform: 'capitalize'
								}}
							>
								{units.map(_unit => (
									<MenuItem
										key={_unit}
										value={_unit}
										sx={{
											fontSize: '1rem',
											fontStyle: 'italic',
											textTransform: 'capitalize'
										}}
									>
										{_unit}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
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
