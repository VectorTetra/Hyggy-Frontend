import React from 'react';
function MainPageHeaderSearch(props) {
    return (
        <div id="mainPageHeaderLogoContainer">
            <input
                type="text"
                placeholder={props.searchText}
            />
        </div>
    );
}
export default MainPageHeaderSearch;