import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './OpenedOrders.css';

import OpenedOrder from '../OpenedOrder/OpenedOrder';

import closeOrder from '../../../services/client/closeOrder';
import autoCloseOrder from '../../../services/client/autoCloseOrder';
import getClosedOrders from '../../../services/client/getOrders';
import checkAuthentication from '../../../services/client/checkAuthentication';

import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';
import messageWebsocket from '../../../services/client/messageWebsocket';
import { AUTO_CLOSE_ORDER_EVENT_CLIENT } from '../../../../../../server/constants/constants';
import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';
import formatPrice from '../../../utils/formatPrice';
import { getCommission, getProfit } from '../../../utils/getAssetValues';
import { COMMISSION } from '../../../constants/constants';

const mapStateToProps = ({ data }) => {
    return {
        closedOrders: data.closedOrders
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeOrder: payload => dispatch(closeOrder(payload)),
    checkAuthentication: payload => dispatch(checkAuthentication(payload)),
    getClosedOrders: payload => dispatch(getClosedOrders(payload)),
    autoCloseOrder: payload => dispatch(autoCloseOrder(payload))
});

class OpenedOrders extends Component {
    static propTypes = {
        closeOrder: PropTypes.func.isRequired,
        getClosedOrders: PropTypes.func.isRequired,
        checkAuthentication: PropTypes.func.isRequired,
        autoCloseOrder: PropTypes.func.isRequired,
        events: PropTypes.object.isRequired,
        closedOrders: PropTypes.array.isRequired
    };

    state = {
        openOrders: [],
        closedOrders: [],
        closeOrderIndex: null,
        isLoading: {}
    };

    componentDidMount () {
        assetPriceWebsocketController.events.on('ordersAndBalance', this.handleOrdersAndBalanceChange);
        messageWebsocket.events.on(AUTO_CLOSE_ORDER_EVENT_CLIENT, (payload) => {
            this.handleAutoCloseOrder(payload);
        });
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps.closedOrders !== this.props.closedOrders) {
            this.setState({
                closedOrders: this.getClosedOrders(nextProps.closedOrders)
            });
        }
    }

    handleAutoCloseOrder = (payload) => this.props.autoCloseOrder({ ...payload, closedOrdersList: this.state.closedOrders });

    handleOrdersAndBalanceChange = ({ balance, orders }) => {
        if (balance <= 0) {
            this.props.checkAuthentication();
        }

        this.setState({
            openOrders: orders
        });
    };

    handlerCloseDeal = index => () => {
        this.setState({
            closeOrderIndex: index
        });
    };

    handleConfirmCloseDeal = order => () => {
        this.setState({ isLoading: { ...this.state.isLoading, loading: true, id: order.id } });
        this.props.closeOrder({ id: order.id, closedOrdersList: this.state.closedOrders })
            .then(() => {
                this.setState({ isLoading: { ...this.state.isLoading, loading: false }, closeOrderIndex: null });
            });
    };

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
        const {
            openOrders,
            closeOrderIndex,
            isLoading
        } = this.state;

        return <div className={styles.openPositionInnerContaimer}>
            <div className={styles.footerHeaderTable}>
                <div className={styles.itemNum}>#</div>
                <div className={styles.itemCreateDate}>Дата создания</div>
                <div className={styles.itemAsset}>Актив</div>
                <div className={styles.itemAmount}>Объем</div>
                <div className={styles.itemPledge}>Залог</div>
                <div className={styles.itemOpeningRate}>Курс открытия</div>
                <div className={styles.itemClosingRate}>Текущий курс</div>
                <div className={styles.itemProfit}>Прибыль</div>
                <div className={styles.itemCommission}>Комиссия</div>
                <div className={styles.profitAndLoss}>Take profit</div>
                <div className={styles.profitAndLoss}>Stop loss</div>
                <div className={styles.itemClosingDate} />
            </div>
            <div className={styles.footerRowsContainer}>
                {openOrders.map((item, i) => {
                    const isConfirmDeal = closeOrderIndex === i;

                    return <OpenedOrder
                        item={item}
                        isLoading={isLoading}
                        isConfirmDeal={isConfirmDeal}
                        orderIndex={i}
                        onClose={this.handlerCloseDeal(i)}
                        onCloseConfirm={this.handleConfirmCloseDeal(item)}
                        onCloseDecline={this.handlerCloseDeal(null)}
                        key={i}
                    />;
                })}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenedOrders);
