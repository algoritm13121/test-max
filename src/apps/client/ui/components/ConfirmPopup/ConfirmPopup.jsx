import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import noop from '@tinkoff/utils/function/noop';
import CircularProgress from '@material-ui/core/CircularProgress';
import isWeekend from 'date-fns/isWeekend';

import styles from './ConfirmPopup.css';
import formStyles from '../FormInput/FormInput.css';
import buyAndSellStyles from '../BuyAndSellComponent/BuyAndSellComponent.css';
import outsideClick from '../../hocs/outsideClick';
import saveOrder from '../../../services/client/saveOrder';

import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';
import { getPledge, getCommission, getOpeningSlotPrice } from '../../../utils/getAssetValues';
import formatNumberToString from '../../../utils/formatNumberToString';
import formatPriceToString from '../../../utils/formatPriceToString';

import { COMMISSION } from '../../../constants/constants';
import numeral from 'numeral';
import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';

import calculateBuyingPrice from '../../../utils/calculateBuyPrice';
import NumberFormat from 'react-number-format';

let timeout;

const cripto = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:LTCUSDT'];

const mapStateToProps = ({ application, data, charts }) => {
    return {
        langMap: application.langMap,
        chartSymbol: charts.chartSymbol,
        chartSymbolGroup: charts.chartSymbolGroup
    };
};

const mapDispatchToProps = (dispatch) => ({
    saveOrder: (payload) => dispatch(saveOrder(payload))
});

@outsideClick
class ConfirmPopup extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        handleOpen: PropTypes.func,
        handleClose: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        turnOnClickOutside: PropTypes.func,
        amount: PropTypes.number.isRequired,
        saveOrder: PropTypes.func.isRequired,
        chartSymbol: PropTypes.object.isRequired,
        setAmount: PropTypes.func.isRequired,
        chartSymbolGroup: PropTypes.object.isRequired
    };

    static defaultProps = {
        handleOpen: noop,
        handleClose: noop,
        setAmount: noop
    };

    state = {
        isSuccessSend: false,
        isFailedSend: false,
        orderInfo: {},
        validationError: '',
        loader: {
            isLoading: false
        },
        isDisableInputs: true,
        takeProfit: '',
        stopLoss: ''
    };

    componentDidMount () {
        assetPriceWebsocketController.events.on('data', this.handlePriceChange);
    }

    handlePriceChange = () => {
        if (!this.props.isOpen) {
            return;
        }

        this.setOrderInfo();
    };

    componentDidUpdate (prevProps) {
        const { outsideClickEnabled } = this.props;

        if (this.props.isOpen && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.props.handleClose);
            setTimeout(() => this.setState({ isSuccessSend: false }));
            clearTimeout(timeout);
        }

        if (this.state.isFailedSend && !outsideClickEnabled) {
            setTimeout(() => this.setState({ isFailedSend: false }));
            this.props.setAmount();
            clearTimeout(timeout);
        }

        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
            this.setOrderInfo();
        }
    }

    setOrderInfo = () => {
        const { chartSymbol, amount, type } = this.props;
        const amountNumber = +amount;
        //console.log('chartSymbol.name', chartSymbol.name);
        const openingPriceSell = assetPriceWebsocketController.prices[chartSymbol.name];
        // console.log('openingPriceSell', openingPriceSell);
        const openingPriceBuy = calculateBuyingPrice(chartSymbol.name, openingPriceSell);
        const asset = CHART_SYMBOL_INFO_MAP[chartSymbol.name];
        // console.log('openingPriceBuy', openingPriceBuy);
        const openingSlotPrice = type === 'sell' ? getOpeningSlotPrice(asset, openingPriceSell) : getOpeningSlotPrice(asset, openingPriceBuy);
        // console.log('openingSlotPrice', openingSlotPrice);
        const pledge = +numeral(getPledge(amountNumber, openingSlotPrice)).format('0.00');
        const commission = getCommission(pledge, COMMISSION);
        const orderInfo = {
            assetName: chartSymbol.name,
            openingPriceSell,
            openingPriceBuy,
            pledge,
            commission,
            amount: amountNumber,
            type
        };

        this.setState({ orderInfo });
    };

    handlerSubmit = () => {
        const { orderInfo } = this.state;
        const isCripto = cripto.find(item => (item === orderInfo.assetName));

        if (orderInfo.amount <= 0 ||
            assetPriceWebsocketController.freeBalance < orderInfo.pledge + orderInfo.commission ||
            (isWeekend(new Date()) && !isCripto)) {
            if (orderInfo.amount <= 0) {
                this.setState({ validationError: 'Incorrect' });
            }
            if (assetPriceWebsocketController.freeBalance < orderInfo.pledge + orderInfo.commission) {
                this.setState({ validationError: 'Balance' });
            }
            if (isWeekend(new Date())) {
                this.setState({ validationError: 'Day' });
            }

            this.setState({ isFailedSend: true });

            timeout = setTimeout(() => {
                this.props.handleClose();
                this.setState({
                    isFailedSend: false
                });
            }, 2000);

            setTimeout(() => {
                this.setState({
                    validationError: ''
                });
            }, 2500);

            this.props.setAmount();
            return;
        }

        this.setState({ loader: { ...this.state.loader, isLoading: true } });

        this.props.saveOrder({
            assetName: orderInfo.assetName,
            amount: orderInfo.amount,
            type: orderInfo.type,
            takeProfit: this.state.takeProfit,
            stopLoss: this.state.stopLoss,
            autoClose: !this.state.isDisableInputs
        })
            .then(() => {
                this.setState({ loader: { ...this.state.loader, isLoading: false } });
                this.props.setAmount();
                this.setState({ isSuccessSend: true });

                timeout = setTimeout(() => {
                    this.props.handleClose();
                    this.setState({ isSuccessSend: false });
                }, 2000);
            });
    };

    handleClose = () => {
        this.props.handleOpen();
    };

    toggleChange = () => {
        this.setState({
            isDisableInputs: !this.state.isDisableInputs
        });
    }

    render () {
        const { type, langMap, isOpen, chartSymbol, chartSymbolGroup } = this.props;
        const { isSuccessSend, orderInfo, isFailedSend, validationError, loader, takeProfit, stopLoss } = this.state;
        const text = propOr('confirmPopup', {}, langMap);
        const assetGroup = chartSymbolGroup.symbols.find(group => {
            return group.name === chartSymbol.name;
        });

        return <div className={styles.root}>
            <div className={classNames(styles.popup, {
                [styles.isOpen]: isOpen,
                [styles.selling]: type === 'sell',
                [styles.isSuccessPopup]: isSuccessSend,
                [styles.popupOnFailed]: isFailedSend
            })}>
                <div className={classNames(styles.popupContainer, {
                    [styles.isPopupVisible]: !isSuccessSend && !isFailedSend && isOpen
                })}>
                    <div className={styles.title}>{text.confirm} {type === 'buy' ? text.confirmPurchase : text.confirmSale}
                        {type === 'buy'
                            ? <img src="/src/apps/client/ui/components/Header/images/posArrow.svg" alt="" />
                            : <img src="/src/apps/client/ui/components/Header/images/negArrow.svg" alt="" />
                        }
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.assets}</div>
                        {
                            assetGroup &&
                            <div>
                                {
                                    assetGroup.imgAlone
                                        ? <div className={styles.assetItemPair}>
                                            <img className={styles.imgAlone} src={assetGroup.imgAlone} alt="asset"/>
                                        </div>
                                        : <div className={styles.assetItemPair}>
                                            <img className={styles.imgUpper} src={assetGroup.imgTop} alt="assets"/>
                                            <img className={styles.imgLower} src={assetGroup.imgBottom} alt="assets"/>
                                        </div>
                                }
                            </div>
                        }
                        <div className={styles.itemValue}>{chartSymbol.title}</div>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.size}</div>
                        <div className={styles.itemValue}>{orderInfo.amount || 0}</div>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.rate}</div>
                        <div className={styles.itemValue}>
                            {type === 'sell'
                                ? formatPriceToString(orderInfo.openingPriceSell)
                                : formatPriceToString(orderInfo.openingPriceBuy)}
                        </div>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.amount}</div>
                        <div className={classNames(styles.itemValue, styles.price)}>$ {formatNumberToString(orderInfo.pledge)}</div>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.inputsName}</div>
                        <input type="checkbox" onChange={this.toggleChange}/>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.takeProfit}</div>
                        <div className={classNames(buyAndSellStyles.counterContainer,
                            styles.counterContainerLeft, this.state.isDisableInputs ? styles.counterDisabled : '')}>
                            <NumberFormat
                                type='text'
                                className={buyAndSellStyles.counter}
                                value={takeProfit}
                                id='input'
                                allowNegative={false}
                                disabled = {(this.state.isDisableInputs) ? 'disabled' : ''}
                                onValueChange={values => {
                                    this.setState({
                                        takeProfit: values.floatValue
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.popupItem}>
                        <div className={styles.itemName}>{text.stopLoss}</div>
                        <div className={classNames(buyAndSellStyles.counterContainer, styles.counterContainerLeft,
                            this.state.isDisableInputs ? styles.counterDisabled : '')}>
                            <NumberFormat
                                type='text'
                                className={buyAndSellStyles.counter}
                                value={stopLoss}
                                id='input'
                                allowNegative={false}
                                disabled = {(this.state.isDisableInputs) ? 'disabled' : ''}
                                onValueChange={values => {
                                    this.setState({
                                        stopLoss: values.floatValue
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.buttonContainers}>
                        {
                            !loader.isLoading
                                ? [<button onClick={this.handlerSubmit} className={styles.confirmButton} key={0}>{text.confirmButton}</button>,
                                    <button onClick={this.handleClose} className={styles.rejectButton} key={1}>
                                        <img src="/src/apps/client/ui/components/Header/images/removeButton.svg" alt="close" />
                                    </button>
                                ]
                                : <div className={styles.preloader}>
                                    <CircularProgress size={26} />
                                </div>
                        }
                    </div>
                </div>
                <div className={classNames(styles.successPopup, {
                    [styles.isSuccessPopupVisible]: isSuccessSend && !isFailedSend
                })}>
                    <div className={styles.title}>{type === 'buy' ? text.purchase : text.sale}{text.successTitle}</div>
                    <img src="/src/apps/client/ui/components/ConfirmPopup/img/successIcon.png" alt="success" />
                </div>
            </div>
            <div className={classNames(styles.failedPopup, {
                [styles.isFailedPopup]: isFailedSend,
                [styles.sellingIsFailedPopup]: type === 'sell'
            })}>
                <img src="/src/apps/client/ui/components/ConfirmPopup/img/info.svg" alt="info" />
                <div className={styles.title}>
                    {/* eslint-disable-next-line max-len */}
                    {text[`failed${validationError}`]}
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPopup);
