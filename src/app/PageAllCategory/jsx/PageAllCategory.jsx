import MainPageBodyCaption from "./MainPageBodyCaption";
import MainPageBodyCategory from "./MainPageBodyCategory";
import styles from "./../styles/MainPageBody-styles.module.css";

export default function PageAllCategory(props) {
	return (
		<div>
			<div>
				<MainPageBodyCaption caption={props.bodyData.bodycaption.caption} />
				<MainPageBodyCategory CategoryName={props.bodyData.category} />
			</div>

		</div>
	)
}
