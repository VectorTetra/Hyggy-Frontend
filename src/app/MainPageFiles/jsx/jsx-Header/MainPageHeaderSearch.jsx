import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

function MainPageHeaderSearch(props) {
    const [searchQuery, setSearchQuery] = useState(''); // Зберігаємо значення введеного тексту
    const router = useRouter();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { // Перевіряємо, чи натиснута клавіша Enter
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Переходимо на сторінку з параметром query
        }
    };

    return (
        // <div className={styles.mainPageHeaderSearchContainer}>
        //     <input
        //         className={styles.inputSearch}
        //         type="text"
        //         placeholder={props.searchText}
        //         value={searchQuery} // Прив’язуємо значення input до стану
        //         onChange={(e) => setSearchQuery(e.target.value)} // Оновлюємо стан при зміні тексту
        //         onKeyDown={handleKeyDown} // Викликаємо handleKeyDown при натисканні клавіші
        //     />
        // </div>


        <div className={styles.mainPageHeaderSearchContainer}>
            <input
                className={styles.inputSearch}
                type="text"
                placeholder={props.searchText}
                value={searchQuery} // Прив’язуємо значення input до стану
                onChange={(e) => setSearchQuery(e.target.value)} // Оновлюємо стан при зміні тексту
                onKeyDown={handleKeyDown} // Викликаємо handleKeyDown при натисканні клавіші
            >

            </input>
            <button onClick={() => { }} className={styles.searchButton}>
                <FontAwesomeIcon icon={faSearch} className="text-[#00AAAD] opacity-60/" />
            </button>
        </div>

        // <TextField
        //     sx={{
        //         padding: "0",
        //         "& .MuiOutlinedInput-root": {
        //     }}
        //     variant="outlined" // Вибираємо варіант "outlined", "filled" або "standard"
        //     placeholder="Search..." // Текст-підказка
        //     value={searchQuery} // Прив’язуємо значення до стану
        //     onChange={(e) => setSearchQuery(e.target.value)} // Оновлюємо стан
        //     onKeyDown={handleKeyDown} // Обробка натискання клавіш
        //     InputProps={{
        //         endAdornment: (
        //             <InputAdornment position="end">
        //                 <IconButton onClick={() => console.log("Search clicked")}>
        //                     <SearchIcon style={{ color: "#00AAAD", opacity: "0.6" }} />
        //                 </IconButton>
        //             </InputAdornment>
        //         ),
        //     }}
        //     fullWidth // Робить інпут на всю ширину контейнера
        // />

    );
}

export default MainPageHeaderSearch;
