import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/MainPageHeader-styles.module.css';

function MainPageHeaderSearch(props) {
    const [searchQuery, setSearchQuery] = useState(''); // Зберігаємо значення введеного тексту
    const router = useRouter();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { // Перевіряємо, чи натиснута клавіша Enter
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Переходимо на сторінку з параметром query
        }
    };

    return (
        <div className={styles.mainPageHeaderSearchContainer}>
            <input
                className={styles.inputSearch}
                type="text"
                placeholder={props.searchText}
                value={searchQuery} // Прив’язуємо значення input до стану
                onChange={(e) => setSearchQuery(e.target.value)} // Оновлюємо стан при зміні тексту
                onKeyDown={handleKeyDown} // Викликаємо handleKeyDown при натисканні клавіші
            />
        </div>
    );
}

export default MainPageHeaderSearch;
