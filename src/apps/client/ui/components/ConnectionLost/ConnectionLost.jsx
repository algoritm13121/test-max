import React, { Component } from 'react';

import styles from './ConnectionLost.css';

class ConnectionLost extends Component {
    render () {
        return <div className={styles.root}>
            <div className={styles.contentContainer}>
                <div className={styles.title}>Отсутствует интернет-соединение</div>
            </div>
            <div className={styles.imageContainer}></div>
        </div>;
    }
}

export default ConnectionLost;
