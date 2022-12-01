import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash.find';

import noop from '@tinkoff/utils/function/noop';

import classNames from 'classnames';

import styles from './LanguagesSelector.css';

import outsideClick from '../../hocs/outsideClick';
import { COUNTRY_INFO, LANGUAGES } from '../../../constants/constants';

@outsideClick
class LanguagesSelector extends Component {
    static propTypes = {
        currentLanguage: PropTypes.object.isRequired,
        title: PropTypes.string,
        setLanguage: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        turnOnClickOutside: PropTypes.func
    };

    state = {
        isLanguageOpen: false
    }

    static defaultProps = {
        setLanguage: noop,
        handleCurrentWidth: noop
    }

    componentDidUpdate () {
        const { outsideClickEnabled } = this.props;
        if (this.state.isLanguageOpen && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => this.setState({ isLanguageOpen: false }));
        }
    }

    handleLanguagesClick = e => {
        e.preventDefault();
        this.setState({ isLanguageOpen: !this.state.isLanguageOpen });
    }

    handleSetLanguage = language => () => {
        this.props.setLanguage(language);
    }

    setFlag = (name) => {
        const item = _find(COUNTRY_INFO, { name });
        if (!item) {
            return;
        }

        return item.flag;
    }

    render () {
        const { title, currentLanguage } = this.props;
        const { isLanguageOpen } = this.state;

        return <div className={classNames(styles.selectorContainer, {
            [styles.selectorContainerActive]: isLanguageOpen
        })} onClick={this.handleLanguagesClick}>
            <img className={styles.iconFlag} src={currentLanguage.flag} alt="flag" />
            {title &&
            <div className={styles.currentCountryTitle}>{title}</div>}
            <div className={classNames(styles.innerCountryContainer, {
                [styles.innerCountryContainerOpen]: isLanguageOpen
            })}>
                {LANGUAGES
                    .filter(language => language.id !== currentLanguage.id)
                    .map(language => <div key={language.id} className={styles.countryContainer} onClick={this.handleSetLanguage(language)}>
                        <img className={styles.iconFlag} src={this.setFlag(language.countryCode)} alt={language.name} />
                        <div className={styles.countryNameBlock}>
                            <div className={styles.countryNameText}>{language.name}</div>
                        </div>
                    </div>)}
            </div>
            <div>
                <img className={classNames(styles.iconArrowDown, {
                    [styles.rotateImg]: isLanguageOpen
                })} src="/src/apps/client/ui/components/PrivateDataFormPopup/images/arrowDown.svg" alt="" />
            </div>
        </div>;
    }
}

export default LanguagesSelector;
