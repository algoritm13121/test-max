import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './RightMenu.css';
import MenuButton from '../MenuButton/MenuButton';
import AssetsButton from '../AssetsButton/AssetsButton';
import TimingScaleButton from '../TimingScaleButton/TimingScaleButton';
import ChartLineButton from '../ChartLineButton/ChartLineButton';

class RightMenu extends Component {
    static propTypes = {
        events: PropTypes.object.isRequired
    };

    render () {
        const { events } = this.props;

        return <div className={styles.root}>
            <div className={styles.menu}>
                <MenuButton events={events} />
                <AssetsButton events={events} />
                <TimingScaleButton events={events} />
                <ChartLineButton events={events} />
                <div className={styles.menuBG} />
            </div>
        </div>;
    }
}

export default RightMenu;
