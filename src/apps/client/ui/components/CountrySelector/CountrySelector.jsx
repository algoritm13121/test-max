import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noop from '@tinkoff/utils/function/noop';

import classNames from 'classnames';

import styles from './CountrySelector.css';

import outsideClick from '../../hocs/outsideClick';
import { COUNTRY_INFO } from '../../../constants/constants';
import langsMap from '../../hocs/lang/maps';

@outsideClick
class CountrySelector extends Component {
    static propTypes = {
        activeCountry: PropTypes.object.isRequired,
        title: PropTypes.string,
        setCountry: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        turnOnClickOutside: PropTypes.func
    };

    state = {
        isCountryOpen: false
    }

    titlleRef = React.createRef();

    static defaultProps = {
        setCountry: noop,
        handleCurrentWidth: noop
    }

    componentDidUpdate () {
        const { outsideClickEnabled } = this.props;
        if (this.state.isCountryOpen && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => this.setState({ isCountryOpen: false }));
        }
    }

    handleCountryClick = e => {
        e.preventDefault();
        this.setState({ isCountryOpen: !this.state.isCountryOpen });
    }

    handleSetCountry = country => () => {
        this.props.setCountry(country);
    }

    render () {
        const { title, activeCountry } = this.props;
        const { isCountryOpen } = this.state;

        return <div className={classNames(styles.selectorContainer, {
            [styles.selectorContainerActive]: isCountryOpen
        })} onClick={this.handleCountryClick}>
            <img className={styles.iconFlag} src={activeCountry.flag} alt="flag" />
            {title &&
            <div className={styles.currentCountryTitle}>{title}</div>}
            <div className={classNames(styles.innerCountryContainer, {
                [styles.innerCountryContainerOpen]: isCountryOpen
            })}>
                {COUNTRY_INFO
                    .filter(country => country.id !== activeCountry.id)
                    .map(country => <div key={country.id} className={styles.countryContainer} onClick={this.handleSetCountry(country)}>
                        <img className={styles.iconFlag} src={country.flag} alt={country.name} />
                        <div className={styles.countryNameBlock}>
                            <div className={styles.countryNameText}>{langsMap.ru.accountInfo.countryInfo[country.name]}</div>
                        </div>
                    </div>)}
            </div>
            <div>
                <img className={classNames(styles.iconArrowDown, {
                    [styles.rotateImg]: isCountryOpen
                })} src="/src/apps/client/ui/components/PrivateDataFormPopup/images/arrowDown.svg" alt="" />
            </div>
        </div>;
    }
}

export default CountrySelector;
