import { TextField } from '@mui/material';

import { ReactComponent as SearchIcon } from '../assets/search.svg';

export const Search = ({
	value,
	onChange
}: {
	value: string;
	onChange: React.ChangeEventHandler;
}) => (
	<TextField
		label="Search"
		className="w-full px-4 py-2 text-gray-700 rounded border-2 focus:outline-none
         focus:ring-2 focus:ring-purple-800 input flex-1"
		type="text"
		onChange={onChange}
		placeholder="Search by name ..."
		InputProps={{
			startAdornment: <SearchIcon className="mr-2 w-10 h-min p-2" />
		}}
		value={value}
	/>
);
