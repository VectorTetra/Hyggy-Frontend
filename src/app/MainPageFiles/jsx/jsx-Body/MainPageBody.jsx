function MainPageBody(props) {
	return (
		<div>
			<hr id="horizontalBar3" />
		<div>
			<MainPageBodySale text={props.bodyData.bodysale.textsale}
			text2={props.bodyData.bodysale.textsale2}
			urlphoto={props.bodyData.bodysale.urlimage}
			urlpagesale={props.bodyData.bodysale.urlsale}/>
		</div>
		<hr id="horizontalBar3" />
	 	<div> 
			<MainPageBodyCaption caption={props.bodyData.bodycaption.caption}/>
	 	 	<MainPageBodyCategory CategoryName={props.bodyData.category}/>
		</div>	
		<hr id="horizontalBar3" />
		<div>
			<MainPageBodyBrandCaption caption={props.bodyData.brandcaption.caption}/>
			<MainPageBodyBrand brand={props.bodyData.brand}/>
		</div>
		<hr id="horizontalBar3" />
		<div>
			<MainPageBodyBlogCaption caption={props.bodyData.blogcaption.caption}/>
			<MainPageBodyBlog blog={props.bodyData.blog}/>
			<MainPageBodyBlogButton button={props.bodyData.blog}/>
		</div>
		<hr id="horizontalBar3" />
		<div>
			<MainPageBodyAboutUs aboutus={props.bodyData.aboutus}/>
		</div>
		
		<div>
			<MainPageBodySubscriptionForm caption={props.bodyData.formmail.caption}
			forminfo={props.bodyData.formmail.forminfo}/>
		</div>
		</div>		
	)
}
