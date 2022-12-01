import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';

import classNames from 'classnames';

import styles from './PaymentsPopup.css';

import propOr from '@tinkoff/utils/object/propOr';

import setPaymentsPopup from '../../../actions/setPaymentsPopup';
import getPayments from '../../../services/client/getPayments';

import outsideClick from '../../hocs/outsideClick.jsx';

import copy from 'copy-to-clipboard';

const PAYMENTS_SYSTEM = [
    { id: 1, name: 'qiwi', icon: '/src/apps/client/ui/components/PaymentsPopup/images/qiwi.svg' },
    { id: 2, name: 'bitcoin', icon: '/src/apps/client/ui/components/PaymentsPopup/images/bit.svg' },
    { id: 3, name: 'visa', icon: '/src/apps/client/ui/components/PaymentsPopup/images/visa.svg' }
];

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        mediaWidth: application.media.width,
        payments: data.payments,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    setPaymentsPopup: payload => dispatch(setPaymentsPopup(payload)),
    getPayments: payload => dispatch(getPayments(payload))
});

@outsideClick
class PaymentsPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        setPaymentsPopup: PropTypes.func,
        getPayments: PropTypes.func,
        isVisible: PropTypes.bool,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        mediaWidth: PropTypes.number.isRequired,
        payments: PropTypes.any.isRequired,
        user: PropTypes.object
    };

    static defaultProps = {
        user: {}
    };

    state = {
        showHidden: false,
        showCopied: false,
        focusField: false,
        amount: '',
        activePayment: '',
        fieldError: ''
    }

    componentDidMount () {
        this.props.getPayments();
    }

    componentDidUpdate (prevProps) {
        const { outsideClickEnabled } = this.props;

        if (!outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.closePopup);
        }

        if (this.props.isVisible !== prevProps.isVisible && !this.props.isVisible) {
            this.setState({
                amount: '',
                fieldError: '',
                showHidden: false
            });
        }
    }

    showHiddenInfo = name => () => {
        if (name === 'visa') {
            return;
        }

        this.setState({
            showHidden: true,
            activePayment: name
        });
    }

    copyToClipBoard = (textToCopy) => {
        copy(textToCopy);
        this.setState({ showCopied: true });

        setTimeout(() => {
            this.setState({ showCopied: false });
        }, 2000);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { payments, user } = this.props;
        const { amount } = this.state;

        if (!amount) {
            this.setState({ fieldError: 'Incorrect' });
            return;
        }

        const message = `Имя: ${user.name} ${user.surname}, номер аккаунта: ${user.accountNumber}`;
        // eslint-disable-next-line max-len
        window.open(`https://qiwi.com/payment/form/99?amountInteger=${amount}&amountFraction=00&currency=643&provider=99&extra[%27account%27]=+${payments.qiwi}&extra[%27comment%27]=${message}&blocked[0]=sum&blocked[1]=account&blocked[2]=comment`);
    }

    handleChangeValue = e => {
        this.setState({
            amount: e.target.value
        });
    };

    handleOutsideClick = () => {
        this.props.turnOnClickOutside(this, this.closePopup);
    }

    closePopup = () => {
        this.props.setPaymentsPopup(false);
    };

    handleFocusBlurField = () => {
        this.setState({ focusField: !this.state.focusField });
    }

    render () {
        const { langMap, isVisible, payments } = this.props;
        const { activePayment, amount, focusField, fieldError } = this.state;
        const text = propOr('payments', {}, langMap);

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
                            <div className={styles.formContainer}>
                                <div className={styles.title}>{text.replenishment}</div>
                                <div className={styles.payments}>
                                    <div className={styles.paymentsContainer}>
                                        {PAYMENTS_SYSTEM.map(payment => <div
                                            key={payment.id}
                                            className={styles.paymentContainer}
                                            onClick={this.showHiddenInfo(payment.name)}
                                        >
                                            {/* eslint-disable-next-line max-len */}
                                            <a className={styles.linkContainer} target="_blank" {...(payment.name === 'visa' ? { href: `${payments.gateway}` } : {})}>
                                                <div className={styles.textContainer}>
                                                    <div className={styles.paymentTitle}>{text[payment.name].title}</div>
                                                    {text[payment.name].subtitle && <div className={styles.paymentSubtitle}>{text[payment.name].subtitle}</div>}
                                                </div>
                                                <img src={payment.icon} alt={payment.name} />
                                            </a>
                                        </div>)}
                                    </div>
                                </div>
                                <div className={classNames(styles.hiddenInfo, { [styles.hiddenInfoOpen]: this.state.showHidden })}>
                                    <div className={classNames(styles.titleTop, {
                                        [styles.isTitleFocus]: focusField,
                                        [styles.errorField]: fieldError && activePayment === 'qiwi'
                                    })}>
                                        {text.info[`${activePayment}TopTitle`]}
                                    </div>
                                    <div className={styles.adressWrapper}>
                                        {
                                            this.state.activePayment === 'bitcoin'
                                                ? <div className={styles.bitcoinAdressContainer}>
                                                    <div className={styles.bitcoinAdress}>
                                                        {payments.bitcoin}
                                                    </div>
                                                    <div className={styles.copy} onClick={() => this.copyToClipBoard(payments.bitcoin)} />
                                                </div>
                                                : <form onSubmit={this.handleSubmit} className={classNames(styles.qiwiAdressContainer, {
                                                    [styles.isInputFocus]: focusField,
                                                    [styles.errorFieldOutline]: fieldError && activePayment === 'qiwi'
                                                })}>
                                                    <NumberFormat
                                                        type='text'
                                                        className={styles.counter}
                                                        value={amount}
                                                        allowNegative={false}
                                                        decimalScale={0}
                                                        placeholder={0}
                                                        thousandSeparator={true}
                                                        prefix="₽"
                                                        onFocus={this.handleFocusBlurField}
                                                        onBlur={this.handleFocusBlurField}
                                                        onValueChange={values => {
                                                            if (!isVisible) {
                                                                return;
                                                            }
                                                            this.setState({
                                                                amount: values.floatValue,
                                                                fieldError: values.floatValue > 0 ? '' : 'Incorrect'
                                                            });
                                                        }}
                                                    />
                                                    <button type='submit' className={styles.sendButton}>
                                                        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            {/* eslint-disable-next-line max-len */}
                                                            <path d="M0.00999999 18L21 9L0.00999999 0L0 7L15 9L0 11L0.00999999 18Z" fill="#A6B1DC" fillOpacity="0.25" />
                                                        </svg>
                                                    </button>
                                                </form>
                                        }
                                    </div>
                                    <div className={classNames(styles.titleBottom, {
                                        [styles.errorField]: fieldError && activePayment === 'qiwi'
                                    })}>
                                        {fieldError && activePayment === 'qiwi' ? text.info[`failed${fieldError}`] : text.info.adressBottomTitle}
                                    </div>
                                </div>
                                <div className={classNames(styles.dontShowCopiedText, { [styles.showCopiedText]: this.state.showCopied })}>
                                    {text.info.copied}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsPopup);
