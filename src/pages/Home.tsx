import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import useLoggedInUser from '../hooks/useLoggedInUser';
import usePageTitle from '../hooks/usePageTitle';
import {
	Category,
	Task,
	categoriesCollection,
	tasksCollection
} from '../firebase';
import TaskGrid from '../components/TaskGrid';
import CategoryGrid from '../components/CategoryGrid';
import { Search } from '../components/Search';

const Home = () => {
	usePageTitle('Home');

	const [tabValue, setTabValue] = useState('1');
	const [tasks, setTasks] = useState<Task[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [inputValue, setInputValue] = useState('');
	const user = useLoggedInUser();

	useEffect(
		() =>
			onSnapshot(tasksCollection, snapshot => {
				setTasks(snapshot.docs.map(doc => doc.data()));
			}),
		[]
	);

	useEffect(
		() =>
			onSnapshot(categoriesCollection, snapshot => {
				setCategories(snapshot.docs.map(doc => doc.data()));
			}),
		[]
	);

	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setTabValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			<TabContext value={tabValue}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList onChange={handleTabChange} aria-label="lab API tabs example">
						<Tab label="Tasks" value="1" />
						<Tab label="Categories" value="2" />
					</TabList>
				</Box>
				<Search
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setInputValue(e.target.value);
					}}
				/>
				<TabPanel value="1">
					<TaskGrid
						tasks={tasks.filter(el =>
							el.name.toLowerCase().includes(inputValue.toLowerCase())
						)}
					/>
				</TabPanel>
				<TabPanel value="2">
					<CategoryGrid
						categories={categories.filter(el =>
							el.name.toLowerCase().includes(inputValue.toLowerCase())
						)}
					/>
				</TabPanel>
			</TabContext>
		</Box>
	);
};
export default Home;
