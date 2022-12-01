import React, { Component } from 'react';

import styles from './NotFoundPage.css';

class NotFoundPage extends Component {
    render () {
        return <div className={styles.root}>
            <div className={styles.contentContainer}>
                <div className={styles.title}>Ошибка 404</div>
            </div>
            <div className={styles.imageContainer}></div>
        </div>;
    }
}

export default NotFoundPage;
