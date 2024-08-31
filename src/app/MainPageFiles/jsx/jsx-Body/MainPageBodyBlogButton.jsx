function MainPageBodyBlogButton(props) {
    return (
        <div className="blog-container2"> 
            {props.button.map(item => (    
                <div className="blog-item2">           
                <a href={item.urlpage} className="blog-button">
                    <div>{item.textbutton}</div>
                </a>
                </div>
            ))}
        </div>
    )
}