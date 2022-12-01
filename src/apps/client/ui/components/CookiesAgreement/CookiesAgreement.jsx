import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';

import { COOKIE_AGREEMENT_NAME } from '../../../constants/constants';
import setCookiesAgreement from '../../../actions/setCookiesAgreement';
import Cookies from 'js-cookie';
import styles from './CookiesAgreement.css';

const EXPIRES_DAYS = 365;

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        cookiesAgreement: application.cookiesAgreement
    };
};

const mapDispatchToProps = dispatch => ({
    setCookiesAgreement: payload => dispatch(setCookiesAgreement(payload))
});

class CookiesAgreement extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        setCookiesAgreement: PropTypes.func.isRequired,
        cookiesAgreement: PropTypes.bool
    };

    static defaultProps = {
        langMap: {},
        cookiesAgreement: false
    };

    constructor (props) {
        super(props);

        this.state = {
            cookiesAnimation: false
        };
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({ cookiesAnimation: true });
        }, 0);
    }

    handleAgreement = () => {
        Cookies.set(COOKIE_AGREEMENT_NAME, '1', { expires: EXPIRES_DAYS });
        this.props.setCookiesAgreement(true);
    };

    handleClose = () => {
        this.props.setCookiesAgreement(true);
    };

    render () {
        const { langMap, cookiesAgreement } = this.props;
        const { cookiesAnimation } = this.state;
        const text = propOr('cookiesAgreement', {}, langMap);

        return (
            !cookiesAgreement &&
            <div>
                <div className={classNames(styles.cookiesContainer, styles.animated, {
                    [styles.fadeInUp]: cookiesAnimation,
                    [styles.fadeOut]: cookiesAgreement
                })}>
                    <div className={styles.content}>
                        {text.text}
                    </div>
                    <button className={styles.closeWrapper} onClick={this.handleClose}>
                        <img src='/src/apps/client/ui/components/CookiesAgreement/img/close.svg' alt='close'/>
                    </button>
                    <button className={styles.agreementButton} onClick={this.handleAgreement}>
                        {text.agree}
                    </button>
                </div>
            </div>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CookiesAgreement);
