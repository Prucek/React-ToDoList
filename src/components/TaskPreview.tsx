import {
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select
} from '@mui/material';
import { FC, PropsWithChildren, useState } from 'react';

import { Task } from '../firebase';
import { ReactComponent as Calendar } from '../assets/calendar.svg';
import { ReactComponent as Time } from '../assets/time.svg';

import { Status, statuses } from './TaskStatus';

type Props = PropsWithChildren<{
	task: Task;
	onClick?: () => void;
}>;

const TaskPreview: FC<Props> = ({ task, onClick }) => {
	const [selected, setSelected] = useState(task.status);

	return (
		<Grid item xs={2} sm={4} md={4} lg={4}>
			<Button
				variant="outlined"
				onClick={onClick}
				sx={{
					color: task.color,
					aspectRatio: '1',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					flex: '1, 1, 0%'
				}}
				// className="Task"
			>
				<div className="flex items-center justify-between mb-2">
					<span className="block font-medium dark:text-slate-200">
						{task.name}
					</span>
				</div>
				<p
					title={task.description}
					className="description mb-2 text-slate-500 dark:text-slate-500 line-clamp-3"
				>
					{task.description}
				</p>
				<time className="p-3 sm:p-4 flex text-left">
					<Calendar className="mr-2 w-4 sm:w-5 h-min" />{' '}
					{task.deadline.toDate().getDate().toString().padStart(2, '0')}/
					{task.deadline.toDate().getMonth().toString().padStart(2, '0')}/
					{task.deadline.toDate().getFullYear()}
				</time>
				<p className="flex">
					<Time className="mr-2 w-4 sm:w-5 h-min" />
					{task.duration} min
				</p>
				<FormControl fullWidth>
					<InputLabel id="status-select-label">Status</InputLabel>
					<Select
						labelId="status-select-label"
						id="status-select"
						value={selected}
						label="Status"
						onChange={event => {
							setSelected(event.target.value as Status);
						}}
						sx={{
							fontSize: '1rem',
							fontStyle: 'italic',
							textTransform: 'capitalize'
						}}
					>
						{statuses.map(status => (
							<MenuItem
								key={status}
								value={status}
								sx={{
									fontSize: '1rem',
									fontStyle: 'italic',
									textTransform: 'capitalize'
								}}
							>
								{status}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Button>
		</Grid>
	);
};

export default TaskPreview;
