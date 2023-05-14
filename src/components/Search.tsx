export const Search = ({
	onChange
}: {
	onChange: React.ChangeEventHandler;
}) => (
	<input
		className="w-full px-4 py-2 text-gray-700 rounded border-2 focus:outline-none
         focus:ring-2 focus:ring-purple-800 mt-2 dark:bg-slate-950"
		type="text"
		onChange={onChange}
		placeholder="Search by the title ..."
	/>
);
