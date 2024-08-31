function MainPageBodyAboutUs(props) {
    return (
        <div className="brand-container"> 
            {props.aboutus.map(item => (
                <div className="brand-item">
                    <a style={{ textDecoration: "none" }} href={item.urlpage}>
                        <img className="imageaboutus" src={item.urlimage} />
                    <div className="aboutus-textcaption">{item.captoin}</div>
                    <div className="aboutus-text">{item.text}</div>
                    </a>
                </div>
            ))}
        </div>
    );
}