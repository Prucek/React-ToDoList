import { Button, Grid } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { Category } from '../firebase';
import { ReactComponent as Time } from '../assets/time.svg';

import CalculateDuration from './CalculateDuration';

type Props = PropsWithChildren<{
	category: Category;
	onClick?: () => void;
}>;

const CategoryPreview: FC<Props> = ({ category, onClick }) => {
	const { calcDuration, calcUnit } = CalculateDuration(category.duration, true);
	return (
		<Grid item xs={2} sm={4} md={4} lg={4}>
			<Button
				variant="outlined"
				onClick={onClick}
				sx={{
					color: category.color,
					aspectRatio: '1',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					flex: '1, 1, 0%'
				}}
			>
				<div className="flex items-center justify-between mb-2">
					<span className="block font-medium dark:text-slate-200">
						{category.name}
					</span>
				</div>
				<p className="flex">
					<Time className="mr-2 w-4 sm:w-5 h-min" />
					{calcDuration}
					{calcUnit}
				</p>
			</Button>
		</Grid>
	);
};

export default CategoryPreview;
