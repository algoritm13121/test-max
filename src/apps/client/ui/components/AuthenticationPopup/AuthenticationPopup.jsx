import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './AuthenticationPopup.css';

import propOr from '@tinkoff/utils/object/propOr';

import setAuthenticationPopup from '../../../actions/setAuthenticationPopup';
import AuthFormPopup from '../../components/AuthFormPopup/AuthFormPopup';

import outsideClick from '../../hocs/outsideClick.jsx';
import RegistrationFormPopup from '../RegistrationFormPopup/RegistrationFormPopup';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        mediaWidth: application.media.width
    };
};

const mapDispatchToProps = (dispatch) => ({
    setAuthenticationPopup: payload => dispatch(setAuthenticationPopup(payload))
});

@outsideClick
class AuthenticationPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        setAuthenticationPopup: PropTypes.func,
        isVisible: PropTypes.bool,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        activeIndex: PropTypes.number.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            activeSlide: 1
        };
    }

    navbarRef = React.createRef();

    componentDidUpdate (prevProps) {
        const { outsideClickEnabled, activeIndex } = this.props;

        if (this.props.isVisible !== prevProps.isVisible && this.props.isVisible && !outsideClickEnabled) {
            this.handleTitleClick(activeIndex)();
            this.props.turnOnClickOutside(this, this.closePopup);
        }
    }

    handleOutsideClick = () => {
        this.props.turnOnClickOutside(this, this.closePopup);
    }

    closePopup = () => {
        this.props.setAuthenticationPopup(false);
    };

    handleTitleClick = index => () => {
        this.setState({
            activeSlide: index
        });
    }

    render () {
        const { langMap, isVisible } = this.props;
        const { activeSlide } = this.state;
        const text = propOr('auth', {}, langMap);

        return <div onClick={this.handleOutsideClick}
            className={classNames(styles.root, {
                [styles.isVisible]: isVisible
            })}>
            <div className={styles.cover} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <div className={classNames(styles.content)}>
                            <button className={classNames(styles.closeButton)} onClick={this.closePopup}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M12 1.05L10.95 0L6 4.95L1.05 0L0 1.05L4.95 6L0 10.95L1.05 12L6 7.05L10.95 12L12 10.95L7.05 6L12 1.05Z" fill="#F8F8F8" />
                                </svg>
                            </button>
                            <div ref={this.navbarRef} className={styles.navbar}>
                                <div onClick={this.handleTitleClick(1)} className={classNames(styles.signInButton, {
                                    [styles.activeButton]: activeSlide === 1
                                })}>{text.signIn}</div>
                                <div onClick={this.handleTitleClick(2)} className={classNames(styles.signUpButton, {
                                    [styles.activeButton]: activeSlide === 2
                                })}>{text.signUp}</div>
                            </div>
                            <div className={styles.formsContainer}>
                                <div className={classNames(styles.authPopupContainer, {
                                    [styles.hidePopupForm]: activeSlide === 2
                                })}>
                                    <AuthFormPopup isVisible={isVisible} />
                                </div>
                                <div className={classNames(styles.registrationPopupContainer, {
                                    [styles.hidePopupForm]: activeSlide === 1
                                })}>
                                    <RegistrationFormPopup isVisible={isVisible} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationPopup);
