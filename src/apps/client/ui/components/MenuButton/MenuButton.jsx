import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _find from 'lodash.find';

import propOr from '@tinkoff/utils/object/propOr';

import classNames from 'classnames';

import styles from './MenuButton.css';
import stylesPrivateDataFormPopup from '../PrivateDataFormPopup/PrivateDataFormPopup.css';
import { COUNTRY_INFO, SCROLL_TOP_LOCKED_EVENT_NAME, LANGUAGES } from '../../../constants/constants';
import setAuthenticationPopup from './../../../actions/setAuthenticationPopup';
import setAccountInfoPopup from './../../../actions/setAccountInfoPopup';
import setPaymentsPopup from './../../../actions/setPaymentsPopup';
import getMessageHistory from '../../../services/client/getMessageHistory';
import messageWebsocketController from '../../../services/client/messageWebsocket';

import logout from '../../../services/client/logOut';
import lang from '../../hocs/lang/lang.jsx';

import ChatPage from '../../pages/ChatPage/ChatPage';
import LanguagesSelector from '../LanguagesSelector/LanguagesSelector';

import outsideClick from '../../hocs/outsideClick.jsx';
import maps from '../../hocs/lang/maps';

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    setAuthenticationPopup: (payload) => dispatch(setAuthenticationPopup(payload)),
    logout: payload => dispatch(logout(payload)),
    setAccountInfoPopup: payload => dispatch(setAccountInfoPopup(payload)),
    setPaymentsPopup: (payload) => dispatch(setPaymentsPopup(payload)),
    getMessageHistory: payload => dispatch(getMessageHistory(payload))
});

@lang
@outsideClick
class MenuButton extends Component {
    static propTypes = {
        lang: PropTypes.string,
        langMap: PropTypes.object.isRequired,
        events: PropTypes.object.isRequired,
        setAuthenticationPopup: PropTypes.func.isRequired,
        user: PropTypes.object,
        logout: PropTypes.func.isRequired,
        setAccountInfoPopup: PropTypes.func.isRequired,
        setPaymentsPopup: PropTypes.func.isRequired,
        getMessageHistory: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        setLang: PropTypes.func.isRequired,
        setLangMap: PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {}
    };

    state = {
        isMenuOpen: false,
        isChatOpen: false,
        currentLanguage: {}
    }

    componentDidMount () {
        messageWebsocketController.events.on('message', this.handleMessage);

        this.setCurrenLanguage();

        this.props.events.on(SCROLL_TOP_LOCKED_EVENT_NAME, () => this.setState({ isMenuOpen: false }));

        this.props.getMessageHistory()
            .then(messages => {
                this.setState({
                    unvisitedMessages: (messages.filter((item) => item.senderId === 'admin' && !item.visited)).length
                });
            });
    }

    setCurrenLanguage () {
        if (typeof window !== 'undefined' && localStorage.lang) {
            const lang = _find(LANGUAGES, { langCode: localStorage.lang });
            const item = _find(COUNTRY_INFO, { name: lang.countryCode });
            if (!item) {
                return;
            }

            this.state.currentLanguage = { flag: item.flag, id: lang.id };
            this.setState({ currentLanguage: { flag: item.flag, id: lang.id, name: lang.name } });
        }

        if (typeof window !== 'undefined' && !localStorage.lang) {
            // this.state = COUNTRY_INFO[0];
            const lang = _find(LANGUAGES, { langCode: COUNTRY_INFO[0].name });
            this.setState({ currentLanguage: { flag: COUNTRY_INFO[0].flag, id: lang.id, name: lang.name } });
        }
    }

    componentDidUpdate () {
        if (this.state.isMenuOpen && !this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleOutsideClick);
        }
    }

    componentWillReceiveProps (nextProps) {
        const currentLanguage = _find(LANGUAGES, { langCode: nextProps.lang });
        const item = _find(COUNTRY_INFO, { name: currentLanguage.countryCode });
        this.setState({ currentLanguage: { id: currentLanguage.id, name: currentLanguage.name, flag: item.flag } });
    }

    componentWillUnmount () {
        messageWebsocketController.events.removeListener('message', this.handleMessage);
    }

    handleMessage = (message) => {
        if (message.receiverId === this.props.user.id) {
            this.setState({
                unvisitedMessages: this.state.unvisitedMessages + 1
            });
        }
    }

    handleOutsideClick = () => {
        this.setState({
            isMenuOpen: false,
            isChatOpen: false
        });
    }

    handlerMenu = () => {
        if (!this.state.isMenuOpen) {
            this.props.events.emit(SCROLL_TOP_LOCKED_EVENT_NAME);
        }

        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
            isChatOpen: false
        });
    }

    openChatHandler = () => {
        this.setState({ isChatOpen: true, unvisitedMessages: 0 });
    }

    handleAuthenticationForm = index => () => {
        this.props.setAuthenticationPopup({ isPopup: true, index });
        this.handleOutsideClick();
    };

    handlerLogOut = () => {
        this.props.logout();
        this.handleOutsideClick();
    }

    handleAccountInfoPopup = () => {
        this.props.setAccountInfoPopup(true);
        this.handleOutsideClick();
    };

    handleDepositPopup = () => {
        this.props.setPaymentsPopup(true);
        this.handleOutsideClick();
    }

    handleSetLanguage = currentLanguage => {
        const langMap = maps[currentLanguage.langCode];
        typeof window !== 'undefined' ? localStorage.lang = currentLanguage.langCode : '';

        const item = _find(COUNTRY_INFO, { name: currentLanguage.countryCode });
        this.setState({ currentLanguage: { id: currentLanguage.id, name: currentLanguage.name, flag: item.flag } });

        this.props.setLangMap(langMap);
        this.props.setLang(currentLanguage.langCode);
    }

    render () {
        const { langMap, user } = this.props;
        const { isMenuOpen, isChatOpen, unvisitedMessages, currentLanguage } = this.state;

        const text = propOr('menu', {}, langMap);
        const textAuthorization = propOr('authorizationPanel', {}, langMap);
        // const textDataInfo = propOr('accountInfo', {}, langMap);
        const text2 = propOr('auth', {}, langMap);

        return <div>
            <div className={classNames(styles.menuContent, {
                [styles.menuOpen]: isMenuOpen,
                [styles.menuContentChatPageOpen]: isChatOpen
            })}>
                {isChatOpen ? <ChatPage closeChatHandler={this.handlerMenu} />
                    : <div>
                        <div className={styles.title}>{text.menuTitleOpen}</div>
                        {user
                            ? <div className={styles.contentContainer}>
                                <div className={styles.contentItem}>
                                    <a target="_blank" href="https://imexfinance.ru/">
                                        <div className={styles.contentItemText}>
                                            <div className={styles.iconContainer}>
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    {/* eslint-disable-next-line max-len */}
                                                    <path d="M21.1836 10.8358L11.5297 1.18895C11.4602 1.1193 11.3776 1.06404 11.2867 1.02634C11.1958 0.988644 11.0984 0.969238 11 0.969238C10.9016 0.969238 10.8042 0.988644 10.7133 1.02634C10.6224 1.06404 10.5398 1.1193 10.4703 1.18895L0.816418 10.8358C0.535168 11.1171 0.375793 11.4991 0.375793 11.8975C0.375793 12.7249 1.04845 13.3975 1.87579 13.3975H2.89298V20.2811C2.89298 20.696 3.22814 21.0311 3.64298 21.0311H9.50001V15.7811H12.125V21.0311H18.357C18.7719 21.0311 19.107 20.696 19.107 20.2811V13.3975H20.1242C20.5227 13.3975 20.9047 13.2405 21.1859 12.9569C21.7695 12.371 21.7695 11.4218 21.1836 10.8358Z" fill="#F8F8F8" fillOpacity="0.5" />
                                                </svg>
                                            </div>
                                            {text.onMainPage}
                                        </div>
                                    </a>
                                </div>
                                <div className={styles.contentItem}>
                                    <div className={styles.contentItemText} onClick={this.handleAccountInfoPopup}>
                                        <div className={styles.iconContainer}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* eslint-disable-next-line max-len */}
                                                <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433283 8.00043 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 7.34783 18.9464 4.80429 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM10 3.57143C10.6357 3.57143 11.2572 3.75994 11.7858 4.11313C12.3144 4.46632 12.7263 4.96833 12.9696 5.55566C13.2129 6.14299 13.2765 6.78928 13.1525 7.41279C13.0285 8.0363 12.7224 8.60903 12.2728 9.05856C11.8233 9.50808 11.2506 9.81421 10.6271 9.93824C10.0036 10.0623 9.35728 9.99861 8.76995 9.75533C8.18262 9.51204 7.68061 9.10006 7.32742 8.57147C6.97423 8.04289 6.78572 7.42144 6.78572 6.78571C6.78478 6.36334 6.86727 5.94495 7.02847 5.55455C7.18967 5.16415 7.4264 4.80943 7.72506 4.51077C8.02372 4.21211 8.37844 3.97538 8.76884 3.81418C9.15924 3.65298 9.57763 3.57049 10 3.57143ZM15.7143 16.3714C14.1479 17.7874 12.1115 18.5713 10 18.5713C7.88847 18.5713 5.85214 17.7874 4.28572 16.3714V15.9571C4.25867 14.9791 4.61859 14.03 5.28729 13.3158C5.956 12.6016 6.87948 12.1801 7.85715 12.1429H12.1429C13.1161 12.1819 14.0352 12.601 14.7029 13.3101C15.3707 14.0192 15.7338 14.9619 15.7143 15.9357V16.3714Z" fill="#F8F8F8" fillOpacity="0.5" />
                                            </svg>
                                        </div>
                                        {text.account}
                                    </div>
                                </div>
                                <div className={styles.contentItem}>
                                    <div className={styles.contentItemText} onClick={this.openChatHandler}>
                                        <div className={styles.iconContainer}>
                                            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* eslint-disable-next-line max-len */}
                                                <path fillRule="evenodd" clipRule="evenodd" d="M22 9.37629C22 14.5547 17.0748 18.7526 11 18.7526C9.91052 18.754 8.82556 18.6162 7.77287 18.3427C6.96987 18.7392 5.126 19.5 2.024 19.9956C1.749 20.0385 1.54 19.7599 1.64863 19.5107C2.13538 18.3909 2.57538 16.8988 2.70738 15.5378C1.023 13.8903 0 11.7338 0 9.37629C0 4.1979 4.92525 0 11 0C17.0748 0 22 4.1979 22 9.37629ZM6.875 9.37629C6.875 9.73154 6.73013 10.0722 6.47227 10.3234C6.21441 10.5746 5.86467 10.7158 5.5 10.7158C5.13533 10.7158 4.78559 10.5746 4.52773 10.3234C4.26987 10.0722 4.125 9.73154 4.125 9.37629C4.125 9.02104 4.26987 8.68034 4.52773 8.42914C4.78559 8.17794 5.13533 8.03682 5.5 8.03682C5.86467 8.03682 6.21441 8.17794 6.47227 8.42914C6.73013 8.68034 6.875 9.02104 6.875 9.37629ZM12.375 9.37629C12.375 9.73154 12.2301 10.0722 11.9723 10.3234C11.7144 10.5746 11.3647 10.7158 11 10.7158C10.6353 10.7158 10.2856 10.5746 10.0277 10.3234C9.76987 10.0722 9.625 9.73154 9.625 9.37629C9.625 9.02104 9.76987 8.68034 10.0277 8.42914C10.2856 8.17794 10.6353 8.03682 11 8.03682C11.3647 8.03682 11.7144 8.17794 11.9723 8.42914C12.2301 8.68034 12.375 9.02104 12.375 9.37629ZM16.5 10.7158C16.8647 10.7158 17.2144 10.5746 17.4723 10.3234C17.7301 10.0722 17.875 9.73154 17.875 9.37629C17.875 9.02104 17.7301 8.68034 17.4723 8.42914C17.2144 8.17794 16.8647 8.03682 16.5 8.03682C16.1353 8.03682 15.7856 8.17794 15.5277 8.42914C15.2699 8.68034 15.125 9.02104 15.125 9.37629C15.125 9.73154 15.2699 10.0722 15.5277 10.3234C15.7856 10.5746 16.1353 10.7158 16.5 10.7158Z" fill="#F8F8F8" fillOpacity="0.5" />
                                            </svg>
                                        </div>
                                        {text.chat}
                                        {unvisitedMessages ? <span className={styles.rate}>{unvisitedMessages}</span> : undefined}
                                    </div>
                                </div>
                                <div className={styles.contentItem}>
                                    <div className={styles.contentItemText} onClick={this.handleDepositPopup}>
                                        <div className={styles.iconContainer}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* eslint-disable-next-line max-len */}
                                                <path fillRule="evenodd" clipRule="evenodd" d="M2 7.5C2 6.83696 2.26339 6.20107 2.73223 5.73223C3.20107 5.26339 3.83696 5 4.5 5H19.5C20.163 5 20.7989 5.26339 21.2678 5.73223C21.7366 6.20107 22 6.83696 22 7.5V13.75H2V7.5ZM16.375 8.75C16.2092 8.75 16.0503 8.81585 15.9331 8.93306C15.8158 9.05027 15.75 9.20924 15.75 9.375V10.625C15.75 10.7908 15.8158 10.9497 15.9331 11.0669C16.0503 11.1842 16.2092 11.25 16.375 11.25H18.875C19.0408 11.25 19.1997 11.1842 19.3169 11.0669C19.4342 10.9497 19.5 10.7908 19.5 10.625V9.375C19.5 9.20924 19.4342 9.05027 19.3169 8.93306C19.1997 8.81585 19.0408 8.75 18.875 8.75H16.375Z" fill="#F8F8F8" fillOpacity="0.5" />
                                                {/* eslint-disable-next-line max-len */}
                                                <path d="M2 16.25V17.5C2 18.163 2.26339 18.7989 2.73223 19.2678C3.20107 19.7366 3.83696 20 4.5 20H19.5C20.163 20 20.7989 19.7366 21.2678 19.2678C21.7366 18.7989 22 18.163 22 17.5V16.25H2Z" fill="#F8F8F8" fillOpacity="0.5" />
                                            </svg>
                                        </div>
                                        {text.deposit}
                                    </div>
                                </div>
                                <div className={styles.contentItem}>
                                    <div className={styles.contentItemText} onClick={this.handlerLogOut}>
                                        <div className={styles.iconContainer}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* eslint-disable-next-line max-len */}
                                                <path d="M7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H15V6.375C15 4.875 13.4161 3.75 12 3.75H4.875C4.17904 3.75074 3.51179 4.02755 3.01967 4.51967C2.52755 5.01179 2.25074 5.67904 2.25 6.375V17.625C2.25074 18.321 2.52755 18.9882 3.01967 19.4803C3.51179 19.9725 4.17904 20.2493 4.875 20.25H12.375C13.071 20.2493 13.7382 19.9725 14.2303 19.4803C14.7225 18.9882 14.9993 18.321 15 17.625V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12Z" fill="#F8F8F8" fillOpacity="0.5" />
                                                {/* eslint-disable-next-line max-len */}
                                                <path d="M21.5302 11.4699L17.7802 7.71994C17.6384 7.58522 17.4495 7.51123 17.254 7.51373C17.0584 7.51624 16.8715 7.59504 16.7332 7.73334C16.5949 7.87164 16.5161 8.0585 16.5136 8.25407C16.5111 8.44964 16.5851 8.63845 16.7198 8.78025L19.1892 11.2501H15V12.7501H19.1892L16.7198 15.2199C16.6473 15.2889 16.5892 15.3717 16.5492 15.4634C16.5091 15.5551 16.4878 15.654 16.4865 15.7541C16.4852 15.8542 16.504 15.9535 16.5417 16.0462C16.5794 16.139 16.6353 16.2232 16.7061 16.294C16.7769 16.3648 16.8611 16.4207 16.9539 16.4584C17.0466 16.4961 17.1459 16.5149 17.246 16.5136C17.3461 16.5123 17.445 16.491 17.5367 16.4509C17.6284 16.4108 17.7112 16.3528 17.7802 16.2802L21.5302 12.5302C21.6707 12.3896 21.7497 12.1989 21.7497 12.0001C21.7497 11.8013 21.6707 11.6106 21.5302 11.4699Z" fill="#F8F8F8" fillOpacity="0.5" />
                                            </svg>
                                        </div>
                                        {text.logOut}
                                    </div>
                                </div>
                                <div className={classNames(styles.contentItem, styles.languagesSelectorMargin)}>
                                    <div className={styles.contentItemTextLang}>
                                        <div className={stylesPrivateDataFormPopup.countryContainerField} onClick={this.handleLanguagesClick}>
                                            <LanguagesSelector
                                                currentLanguage={currentLanguage}
                                                setLanguage={this.handleSetLanguage}
                                                title={currentLanguage.name}
                                            />
                                            <div className={stylesPrivateDataFormPopup.topLabel}>{text.language}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <div className={styles.contentContainer}>
                                <div className={styles.contentItem}>
                                    <a target="_blank" href="https://imexfinance.ru/">
                                        <div className={styles.contentItemText}>
                                            <div className={styles.iconContainer}>
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    {/* eslint-disable-next-line max-len */}
                                                    <path d="M21.1836 10.8358L11.5297 1.18895C11.4602 1.1193 11.3776 1.06404 11.2867 1.02634C11.1958 0.988644 11.0984 0.969238 11 0.969238C10.9016 0.969238 10.8042 0.988644 10.7133 1.02634C10.6224 1.06404 10.5398 1.1193 10.4703 1.18895L0.816418 10.8358C0.535168 11.1171 0.375793 11.4991 0.375793 11.8975C0.375793 12.7249 1.04845 13.3975 1.87579 13.3975H2.89298V20.2811C2.89298 20.696 3.22814 21.0311 3.64298 21.0311H9.50001V15.7811H12.125V21.0311H18.357C18.7719 21.0311 19.107 20.696 19.107 20.2811V13.3975H20.1242C20.5227 13.3975 20.9047 13.2405 21.1859 12.9569C21.7695 12.371 21.7695 11.4218 21.1836 10.8358Z" fill="#F8F8F8" fillOpacity="0.5" />
                                                </svg>
                                            </div>
                                            {text.onMainPage}
                                        </div>
                                    </a>
                                </div>
                                <div className={styles.contentItem}>
                                    <div className={styles.iconContainer}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {/* eslint-disable-next-line max-len */}
                                            <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433283 8.00043 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 7.34783 18.9464 4.80429 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM10 3.57143C10.6357 3.57143 11.2572 3.75994 11.7858 4.11313C12.3144 4.46632 12.7263 4.96833 12.9696 5.55566C13.2129 6.14299 13.2765 6.78928 13.1525 7.41279C13.0285 8.0363 12.7224 8.60903 12.2728 9.05856C11.8233 9.50808 11.2506 9.81421 10.6271 9.93824C10.0036 10.0623 9.35728 9.99861 8.76995 9.75533C8.18262 9.51204 7.68061 9.10006 7.32742 8.57147C6.97423 8.04289 6.78572 7.42144 6.78572 6.78571C6.78478 6.36334 6.86727 5.94495 7.02847 5.55455C7.18967 5.16415 7.4264 4.80943 7.72506 4.51077C8.02372 4.21211 8.37844 3.97538 8.76884 3.81418C9.15924 3.65298 9.57763 3.57049 10 3.57143ZM15.7143 16.3714C14.1479 17.7874 12.1115 18.5713 10 18.5713C7.88847 18.5713 5.85214 17.7874 4.28572 16.3714V15.9571C4.25867 14.9791 4.61859 14.03 5.28729 13.3158C5.956 12.6016 6.87948 12.1801 7.85715 12.1429H12.1429C13.1161 12.1819 14.0352 12.601 14.7029 13.3101C15.3707 14.0192 15.7338 14.9619 15.7143 15.9357V16.3714Z" fill="#F8F8F8" fillOpacity="0.5" />
                                        </svg>
                                    </div>
                                    <div className={styles.signIn} onClick={this.handleAuthenticationForm(1)}>
                                        <div className={styles.contentItemText}>{textAuthorization.signIn}</div>
                                    </div>
                                </div>
                                <div className={classNames(styles.contentItem, styles.languagesSelectorMargin)}>
                                    <div className={styles.contentItemTextLang}>
                                        <div className={stylesPrivateDataFormPopup.countryContainerField} onClick={this.handleLanguagesClick}>
                                            <LanguagesSelector
                                                currentLanguage={currentLanguage}
                                                setLanguage={this.handleSetLanguage}
                                                title={currentLanguage.name}
                                            />
                                            <div className={stylesPrivateDataFormPopup.topLabel}>{text2.inputs.country.placeholder}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>}
            </div>
            <div className={classNames(styles.buttonContainer, {
                [styles.buttonActive]: isMenuOpen
            })} onClick={this.handlerMenu}>
                <img className={classNames(styles.buttonImg, {
                    [styles.activeButtonImg]: isMenuOpen
                })} src="/src/apps/client/ui/components/MenuButton/images/activeButton.svg" alt="" />
                <div className={classNames(styles.burgerButton, {
                    [styles.menuActive]: isMenuOpen
                })}>
                    <span className={styles.burgerLine} />
                </div>
                {!isMenuOpen
                    ? <div className={styles.button}>{text.menuTitleOpen}</div>
                    : <div className={classNames(styles.button, styles.activeButtonText)}>{text.menuTitleClose}</div>}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton);
