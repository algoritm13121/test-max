import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import format from 'date-fns/format';

import classNames from 'classnames';

import styles from './TradeHistoryInfoPopup.css';

import propOr from '@tinkoff/utils/object/propOr';
import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';
import { COMMISSION } from '../../../constants/constants';

import formatPrice from '../../../utils/formatPrice';
import formatNumberToString from '../../../utils/formatNumberToString';
import formatPriceToString from '../../../utils/formatPriceToString';
import getRoundValue from '../../../utils/getRoundValue';
import { getProfit, getCommission } from '../../../utils/getAssetValues';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        closedOrders: data.closedOrders
    };
};

class TradeHistoryInfoPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        closedOrders: PropTypes.array.isRequired
    };

    static defaultProps = {
        closedOrders: []
    }

    state = {
        closedOrders: []
    }

    getTime = time => {
        const date = new Date(time);
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();

        return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`;
    };

    componentDidMount () {
        this.setState({
            closedOrders: this.getClosedOrders(this.props.closedOrders)
        });
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps.closedOrders !== this.props.closedOrders) {
            this.setState({
                closedOrders: this.getClosedOrders(nextProps.closedOrders)
            });
        }
    }

    getClosedOrders = orders => {
        return orders.map(order => {
            const asset = CHART_SYMBOL_INFO_MAP[order.assetName];
            const diffPrice = formatPrice(order.closedPrice - order.openingPrice);
            const profit = getProfit(order.amount, order.openingPrice, order.closedPrice, order.type, asset);
            const commission = getCommission(order.pledge, COMMISSION);

            return ({
                ...order,
                diffPrice,
                profit,
                commission
            });
        });
    };

    render () {
        const { langMap } = this.props;
        const { closedOrders } = this.state;
        const text = propOr('accountInfo', {}, langMap).tradeHistory;

        return <div className={styles.tradeHistoryPopupContainer}>
            <div className={styles.navbar}>
                <div className={styles.itemNum}>#</div>
                <div className={styles.itemCreateDate}>{text.dateTitle}</div>
                <div className={styles.itemCloseDate}>{text.dateCloseTitle}</div>
                <div className={styles.itemAsset}>{text.assetTitle}</div>
                <div className={styles.itemAmount}>{text.amountTitle}</div>
                <div className={styles.itemPledge}>{text.pledgeTitle}</div>
                <div className={styles.itemOpeningRate}>{text.openingRateTitle}</div>
                <div className={styles.itemClosingRate}>{text.closingRateTitle}</div>
                <div className={styles.itemProfit}>{text.profitTitle}</div>
                <div className={styles.itemCommission}>{text.commissionTitle}</div>
                <div className={styles.itemClosingDate}>{text.closingDate}</div>
            </div>
            <div className={styles.tradeHistoryContainer}>
                {closedOrders
                    .sort((prev, next) => next.closedAt - prev.closedAt)
                    .map((item, i) => <div key={i} className={styles.tradeItem}>
                        <div className={classNames(styles.itemNum, styles.footerItems)}>{i + 1}</div>
                        <div className={classNames(styles.itemCreateDate, styles.footerItems)}>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</div>
                        <div className={classNames(styles.itemCloseDate, styles.footerItems)}>{format(new Date(item.closedAt), 'dd.MM.yyyy')}</div>
                        <div className={classNames(styles.itemAsset, styles.footerItems)}>
                            {
                                CHART_SYMBOL_INFO_MAP[item.assetName].title
                            }
                            <img
                                className={styles.secondImg}
                                src={item.type === 'buy'
                                    ? '/src/apps/client/ui/components/Footer/images/arrowUp.svg'
                                    : '/src/apps/client/ui/components/Footer/images/arrowDown.svg'}
                                alt=""
                            />
                        </div>
                        <div className={classNames(styles.itemAmount, styles.footerItems)}>{formatNumberToString(item.amount)}</div>
                        <div className={classNames(styles.itemPledge, styles.footerItems)}>$ {formatNumberToString(item.pledge)}</div>
                        <div className={classNames(styles.itemOpeningRate, styles.footerItems)}>{formatNumberToString(item.openingPrice)}</div>
                        <div className={classNames(styles.itemClosingRate, styles.footerItems)}>
                            <div className={styles.itemClosingRateText}>{formatPriceToString(item.closedPrice)}</div>
                            <div className={classNames(styles.itemDiffRate, {
                                [styles.posValue]: item.diffPrice > 0,
                                [styles.negValue]: item.diffPrice < 0
                            })}>{item.diffPrice > 0 && '+'} {formatPriceToString(item.diffPrice)}</div>
                        </div>
                        <div className={classNames(styles.itemProfit, styles.footerItems, {
                            [styles.posValue]: item.profit > 0,
                            [styles.negValue]: item.profit < 0
                        })}>$ {formatNumberToString(item.profit)}</div>
                        <div className={classNames(styles.itemCommission, styles.footerItems)}>$ {getRoundValue(item.commission, 2)}</div>
                        <div className={classNames(styles.itemClosingDate, styles.footerItems)}>{this.getTime(item.closedAt)}</div>
                    </div>)}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(TradeHistoryInfoPopup);
