import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import isUndefined from '@tinkoff/utils/is/undefined';

import styles from './BuyAndSellComponent.css';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';

import formatPriceToString from '../../../utils/formatPriceToString';

import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';

import calculateBuyingPrice from '../../../utils/calculateBuyPrice';

const MAX_AVAILABLE_PRICE = 100000;
const MIN_AVAILABLE_PRICE = 0.01;

const mapStateToProps = ({ application, charts }) => {
    return {
        langMap: application.langMap,
        chartSymbol: charts.chartSymbol
    };
};

class BuyAndSellComponent extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        chartSymbol: PropTypes.object
    };

    state = {
        buyIsOpen: false,
        sellIsOpen: false,
        amount: MIN_AVAILABLE_PRICE,
        buyPrice: 0,
        sellPrice: 0
    };

    componentDidMount () {
        this.setNewPriceBySymbol(this.props.chartSymbol);
        assetPriceWebsocketController.events.on('data', this.handlePriceChange);
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps.chartSymbol !== this.props.chartSymbol) {
            this.setNewPriceBySymbol(nextProps.chartSymbol);
        }
    }

    setNewPriceBySymbol = chartSymbol => {
        const price = assetPriceWebsocketController.prices[chartSymbol.name];

        this.setState({
            buyPrice: price,
            sellPrice: price
        });
    };

    handlePriceChange = data => {
        const { chartSymbol } = this.props;

        if (data.name !== chartSymbol.name) {
            return;
        }

        this.setState({
            buyPrice: calculateBuyingPrice(chartSymbol.name, data.price),
            sellPrice: data.price
        });
    };

    handleBuyClick = () => {
        this.setState({
            buyIsOpen: !this.state.buyIsOpen
        });
    };

    handleSellClick = () => {
        this.setState({ sellIsOpen: !this.state.sellIsOpen });
    };

    handleClose = () => {
        this.setState({
            buyIsOpen: false,
            sellIsOpen: false
        });
    };

    handleSetValue = value => () => {
        const amount = isUndefined(this.state.amount) ? MIN_AVAILABLE_PRICE : +this.state.amount + value;

        if (amount >= MIN_AVAILABLE_PRICE) {
            this.setState({ amount });
        }
    };

    setAmount = () => {
        this.setState({ amount: MIN_AVAILABLE_PRICE });
    };

    onBlur = () => {
        if (!this.state.amount) {
            this.setAmount(0);
        }
    }

    render () {
        const { langMap } = this.props;
        const { buyIsOpen, sellIsOpen, amount, buyPrice, sellPrice } = this.state;
        const text = propOr('header', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.buyAndSell}>
                <div className={styles.buy} >
                    <div onClick={this.handleBuyClick}>
                        <div className={styles.title}>{text.buy}</div>
                        <div className={styles.price}>{formatPriceToString(buyPrice)}</div>
                    </div>
                    <div className={classNames(styles.confirmPopupContainer, {
                        [styles.confirmPopupContainerActive]: buyIsOpen
                    })}>
                        <ConfirmPopup
                            handleClose={this.handleClose}
                            handleOpen={this.handleBuyClick}
                            setAmount={this.setAmount}
                            isOpen={buyIsOpen}
                            type='buy'
                            amount={amount}
                        />
                    </div>
                </div>
                <div className={styles.counterContainer}>
                    <label className={classNames(styles.arrows, styles.arrowUp)} htmlFor="input" onClick={this.handleSetValue(+0.01)}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M1.7925 7.2085L6 3.24246L10.2075 7.2085L11.5 5.98751L6 0.79183L0.5 5.98751L1.7925 7.2085Z" fill="#F8F8F8" fillOpacity="0.75" />
                        </svg>
                    </label>
                    <label className={classNames(styles.arrows, styles.arrowDown)} htmlFor="input" onClick={this.handleSetValue(-0.01)}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M1.7925 0.791504L6 4.75754L10.2075 0.791504L11.5 2.01249L6 7.20817L0.5 2.01249L1.7925 0.791504Z" fill="#F8F8F8" fillOpacity="0.5" />
                        </svg>
                    </label>
                    <NumberFormat
                        type='text'
                        className={styles.counter}
                        value={amount}
                        id='input'
                        allowNegative={false}
                        decimalScale={2}
                        thousandSeparator={true}
                        onBlur={() => {
                            if (!this.state.amount) {
                                this.setAmount(0);
                            }
                        }}
                        onValueChange={values => {
                            this.setState({
                                amount: values.floatValue
                            });
                        }}
                        isAllowed={(values) => {
                            const { formattedValue, floatValue } = values;
                            return formattedValue === '' || floatValue <= MAX_AVAILABLE_PRICE;
                        }}
                    />
                </div>
                <div className={styles.sell}>
                    <div onClick={this.handleSellClick}>
                        <div className={styles.title}>{text.sell}</div>
                        <div className={styles.price}>{formatPriceToString(sellPrice)}</div>
                    </div>
                    <div className={classNames(styles.sellingPopupContainer, {
                        [styles.confirmPopupContainerActive]: sellIsOpen
                    })}>
                        <ConfirmPopup
                            handleClose={this.handleClose}
                            handleOpen={this.handleSellClick}
                            setAmount={this.setAmount}
                            isOpen={sellIsOpen}
                            type='sell'
                            amount={amount}
                        />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(BuyAndSellComponent);
