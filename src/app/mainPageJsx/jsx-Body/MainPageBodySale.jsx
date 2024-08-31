function MainPageBodySale(props) {
    return (
        <div className="bodysale">
            <img src={props.urlphoto} className="bodysale-image" />
            <div className="bodysale-text">
                {props.text}
				<br/><br/>
				<a className="text-link" href={props.urlpagesale}>
    				{props.text2}
				</a>
            </div>
        </div>			
    )
}