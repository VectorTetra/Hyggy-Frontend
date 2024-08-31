function MainPageBodyCategory(props) {
    return (
        <div className="category-container"> 
            {props.CategoryName.map(item => (
                <div className="category-item">
                    <a href={item.urlcategory} className="category-link">
                        <img src={item.urlimage} alt={item.nameCategory} className="category-image" />
                        <div className="category-text">{item.nameCategory}</div>
                    </a>
                </div>
            ))}
        </div>
    );
}