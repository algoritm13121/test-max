import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Header.css';
import AuthorizationPanel from '../AuthorizationPanel/AuthorizationPanel';
import MenuButton from '../MenuButton/MenuButton';
import ChartLineButton from '../ChartLineButton/ChartLineButton';
import TimingScaleButton from '../TimingScaleButton/TimingScaleButton';
import BuyAndSellComponent from '../BuyAndSellComponent/BuyAndSellComponent';

import setPaymentsPopup from './../../../actions/setPaymentsPopup';
import maps from '../../hocs/lang/maps';
import lang from '../../hocs/lang/lang';

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPaymentsPopup: (payload) => dispatch(setPaymentsPopup(payload))
});

@lang
class Header extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        events: PropTypes.object.isRequired,
        user: PropTypes.object,
        setPaymentsPopup: PropTypes.func.isRequired,
        setLang: PropTypes.func.isRequired,
        setLangMap: PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {}
    };

    state = {
        time: new Date(),
        currentLanguage: ''
    }

    componentDidMount () {
        setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);

        this.setCurrenLanguage();
    }

    componentWillReceiveProps (nextProps) {
        this.setState({ currentLanguage: nextProps.lang });
    }

    handleAccountInfoPopup = () => {
        this.props.setPaymentsPopup(true);
    };

    setLang = (lang) => {
        const langMap = maps[lang];
        typeof window !== 'undefined' ? localStorage.lang = lang : '';

        this.props.setLangMap(langMap);
        this.props.setLang(lang);
    }

    setCurrenLanguage () {
        if (typeof window !== 'undefined' && localStorage.lang) {
            this.setState({ currentLanguage: localStorage.lang });
        }

        if (typeof window !== 'undefined' && !localStorage.lang) {
            this.setState({ currentLanguage: this.props.lang });
        }
    }

    render () {
        const { time, currentLanguage } = this.state;
        const { langMap, events, user } = this.props;
        const text = propOr('header', {}, langMap);

        const CURRENT_TIME = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2);

        return <div className={styles.root}>
            <div className={styles.mobileNavBarItems}>
                <MenuButton events={events} />
                <ChartLineButton events={events} />
                <TimingScaleButton events={events} />
            </div>
            <a href="/">
                <img className={styles.logo} src="/src/apps/client/ui/components/Header/images/mainLogo.svg" alt="logo" />
            </a>
            <div className={styles.timeLangWrapper}>
            {/* <div className={styles.langBlock}>
                    <a onClick={(e) => {
                        e.preventDefault();
                        this.setLang('ru');
                    }} className={currentLanguage === 'ru' ? styles.activeLangLink : styles.langLink}>RU</a>
                    <div className={styles.iconStick}>|</div>
                    <a onClick={(e) => {
                        e.preventDefault();
                        this.setLang('pl');
                    }} className={currentLanguage === 'pl' ? styles.activeLangLink : styles.langLink}>PL</a>
                    <div className={styles.iconStick}>|</div>
                    <a onClick={(e) => {
                        e.preventDefault();
                        this.setLang('en');
                    }} className={currentLanguage === 'en' ? styles.activeLangLink : styles.langLink}>EN</a>
                </div> */}
                <div className={styles.timeContainer}>
                    <img className={styles.timeIcon} src="/src/apps/client/ui/components/Header/images/time.svg" alt="time" />
                    <div className={styles.timeInnerContainer}>
                        <div className={styles.time}>
                            {CURRENT_TIME}
                        </div>
                    </div>
                    <div className={styles.timeFormat}>{text.timeFormat}</div>
                </div>
            </div>

            {user && <div className={styles.buyAndSellContainer}><BuyAndSellComponent /></div>}
            <AuthorizationPanel />
            {user && <div className={styles.depositButton} onClick={this.handleAccountInfoPopup}>
                <img className={styles.depositButton} src="/src/apps/client/ui/components/Header/images/deposit.svg" alt="deposit" />
            </div>}

        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
