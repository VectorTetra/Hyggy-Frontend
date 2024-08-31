function MainPageBodyBrand(props) {
    return (
        <div className="brand-container"> 
            {props.brand.map(item => (
                <div className="brand-item">
                    <a href={item.urlBrand}>
                        <img src={item.urlimage} />
                    </a>
                </div>
            ))}
        </div>
    );
}