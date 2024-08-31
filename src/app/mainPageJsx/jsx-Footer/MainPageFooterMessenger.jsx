import React from 'react';
import styles from "../../mainPageStyles/MainPageFooter-styles.module.css";
import Link from 'next/link';

function MainPageFooterMessenger(props) {
    return (
        <div className={styles["footer-messenger"]}> 
            {props.messenger.map(item => (
                <div key={item.id}>
                    <Link href={item.urlpage}>
                        <img src={item.urlimages} />
                    </Link>
                </div>
            ))}
        </div>
    );
}
export default MainPageFooterMessenger;