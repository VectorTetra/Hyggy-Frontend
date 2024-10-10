import styles from "../css/FilterButton.module.css";
import Image from "next/image";

export default function FilterButton(props: any) {
  return (
    <button onClick={props.onClick}
      className={`${styles.filterButton} ${props.dissappearOnAdapt === true ? styles.dissappearOnAdapt : null
        }`}
    >
      {props.beforeImageSrc !== undefined && (
        <Image src={props.beforeImageSrc} alt="" width={20} height={20} style={{ marginRight: "10px" }} />
      )}

      {props.text !== undefined && <span>{props.text}</span>}

      {props.afterImageSrc !== undefined && (
        <Image src={props.afterImageSrc} alt="" width={20} height={20} style={{ marginLeft: "10px" }} />
      )}
    </button>
  );
}
