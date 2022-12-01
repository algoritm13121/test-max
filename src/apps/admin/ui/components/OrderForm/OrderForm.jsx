import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSchema from './orderFormSchema';
import editOrder from '../../../services/editOrder';

import Form from '../Form/Form';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import uniqid from 'uniqid';
import format from 'date-fns/format';

import { getPledge, getOpeningSlotPrice } from '../../../../client/utils/getAssetValues';
import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const ORDERS_VALUES = ['userId', 'id'];

const materialStyles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark
    },
    success: {
        backgroundColor: theme.palette.success.main
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    }
});

const mapDispatchToProps = (dispatch) => ({
    editOrder: payload => dispatch(editOrder(payload))
});

class OrderForm extends Component {
    static propTypes = {
        editOrder: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        order: PropTypes.object,
        users: PropTypes.array,
        activeUser: PropTypes.object,
        classes: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        order: {},
        users: [],
        activeUser: {}
    };

    constructor (props) {
        super(props);

        const { order, activeUser } = this.props;
        this.dirName = order.dirName || uniqid();
        this.isClosed = order.isClosed;
        this.initialValues = {
            assetName: order.assetName || '',
            createdAt: order.createdAt ? format(order.createdAt, "yyyy-MM-dd'T'HH:mm") : format(new Date(), 'yyyy-MM-dd'),
            openingPrice: order.openingPrice || '',
            amount: order.amount || '',
            pledge: order.pledge || '',
            type: order.type || 'buy',
            ...(order.closedAt ? { closedAt: format(order.closedAt, "yyyy-MM-dd'T'HH:mm") } : {}),
            ...(order.closedPrice ? { closedPrice: order.closedPrice } : {}),
            ...pick(ORDERS_VALUES, order),
            takeProfit: order.takeProfit || '',
            stopLoss: order.stopLoss || ''
        };
        this.id = prop('id', order);
        this.state = {
            activeUser: activeUser,
            errorText: ''
        };
    }

    getOrderPayload = (
        {
            assetName,
            createdAt,
            openingPrice,
            amount,
            pledge,
            type,
            closedAt,
            closedPrice,
            takeProfit,
            stopLoss
        }) => {
        const { activeUser } = this.props;
        return {
            assetName,
            createdAt: +new Date(createdAt),
            openingPrice,
            amount,
            pledge,
            type,
            ...(closedAt ? { closedAt: +new Date(closedAt) } : {}),
            ...(closedPrice ? { closedPrice } : {}),
            dirName: this.dirName,
            userId: activeUser.id,
            isClosed: this.isClosed,
            takeProfit,
            stopLoss
        };
    };

    handleSubmit = async values => {
        const orderPayload = this.getOrderPayload(values);
        const { editOrder, onDone } = this.props;

        return new Promise(async (resolve, reject) => {
            try {
                await editOrder({ ...orderPayload, id: this.id });
                onDone();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };

    handleChange = (values, changes) => {
        switch (Object.keys(changes)[0]) {
        case 'userId':
            const activeUser = this.props.users.find(user => user.id === changes.userId);
            const { lang } = this.state;

            values.orderId = activeUser.texts[lang].order[0].id;
            break;
        case 'amount':
            const asset = CHART_SYMBOL_INFO_MAP[values.assetName];
            const openingSlotPrice = getOpeningSlotPrice(asset, values.openingPrice);
            const pledge = getPledge(+changes.amount, openingSlotPrice);

            values.pledge = pledge;
            break;
        }
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes } = this.props;
        const { errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование ордера' : 'Добавление ордера',
                        dirName: this.dirName,
                        isClosed: this.isClosed
                    }
                })}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
            />

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={!!errorText}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            { errorText }
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(OrderForm));
