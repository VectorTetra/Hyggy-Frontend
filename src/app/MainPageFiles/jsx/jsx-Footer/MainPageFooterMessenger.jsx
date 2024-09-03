import React from 'react';
import styles from '../../styles/MainPageFooter-styles.module.css';
import Link from 'next/link';

function MainPageFooterMessenger(props) {
    return (
        <div className={styles["footer-messenger"]}> 
            {props.messenger.map((item,index) => (
                <div key={index}>
                    <Link href={item.urlpage}>
                        <img src={item.urlimages} />
                    </Link>
                </div>
            ))}
        </div>
    );
}
export default MainPageFooterMessenger;