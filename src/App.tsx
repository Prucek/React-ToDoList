import './App.css';
import { ReactComponent as ReactLogo } from './assets/react.svg';

const App = () => (
	<div className="App">
		<div>
			<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
				<img src="/vite.svg" className="logo" alt="Vite logo" />
			</a>
			<a href="https://reactjs.org" target="_blank" rel="noreferrer">
				<ReactLogo className="logo react" title="React logo" />
			</a>
		</div>
		<h1>ToDoList</h1>
	</div>
);

export default App;
