import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchFieldProps {
	searchTerm: string;
	onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchTerm, onSearchChange }) => {
	return (
		<TextField
			label="Швидкий пошук"
			variant="outlined"
			size="small"
			value={searchTerm}
			onChange={onSearchChange}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" style={{ width: '40px' }}>
						<IconButton
							hidden={searchTerm.length === 0}
							onClick={() => onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
							<ClearIcon />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default SearchField;
// import React from 'react';
// import { TextField, InputAdornment, IconButton } from '@mui/material';
// import ClearIcon from '@mui/icons-material/Clear';

// interface SearchFieldProps {
// 	searchTerm: string;
// 	onSearchChange: (value: string) => void; // Змінено тип для onSearchChange
// }

// const SearchField: React.FC<SearchFieldProps> = ({ searchTerm, onSearchChange }) => {
// 	const handleClear = () => {
// 		onSearchChange(''); // Передаємо лише рядок, без фальшивого `ChangeEvent`
// 	};

// 	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		onSearchChange(event.target.value);
// 	};

// 	return (
// 		<TextField
// 			label="Швидкий пошук"
// 			variant="outlined"
// 			size="small"
// 			value={searchTerm}
// 			onChange={handleInputChange}
// 			InputProps={{
// 				endAdornment: (
// 					<InputAdornment position="end">
// 						{searchTerm && (
// 							<IconButton onClick={handleClear}>
// 								<ClearIcon />
// 							</IconButton>
// 						)}
// 					</InputAdornment>
// 				),
// 			}}
// 		/>
// 	);
// };

// export default SearchField;
