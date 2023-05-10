import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';

import TaskGrid from '../components/TaskGrid';
import { Task, tasksCollection } from '../firebase';
import usePageTitle from '../hooks/usePageTitle';
import useLoggedInUser from '../hooks/useLoggedInUser';

const Home = () => {
	usePageTitle('Home');

	const [tasks, setTasks] = useState<Task[]>([]);
	const user = useLoggedInUser();

	useEffect(
		() =>
			onSnapshot(tasksCollection, snapshot => {
				setTasks(snapshot.docs.map(doc => doc.data()));
			}),
		[]
	);
	return <TaskGrid tasks={tasks} />;
};
export default Home;
