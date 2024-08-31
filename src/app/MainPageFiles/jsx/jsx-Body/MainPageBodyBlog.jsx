function MainPageBodyBlog(props) {
    return (
        <div className="blog-container"> 
            {props.blog.map(item => (
                <div className="blog-item" key={item.urlpage}>
                    <a href={item.urlpage}>
                        <img src={item.urlimage} alt={item.alt} className="blog-image"/>
                        <div className="blog-caption">{item.textblog.textcaption}</div>
                    </a>
                    <div className="blog-text">{item.textblog.text}</div>                  
                </div>
            ))}
        </div>
    )
}