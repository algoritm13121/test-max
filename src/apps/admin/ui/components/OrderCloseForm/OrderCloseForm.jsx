import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSchema from './orderCloseFormSchema';
import closeOrder from '../../../services/closeOrder';

import Form from '../Form/Form';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import uniqid from 'uniqid';
import format from 'date-fns/format';

const ORDERS_VALUES = ['userId', 'id'];

const mapDispatchToProps = (dispatch) => ({
    closeOrder: payload => dispatch(closeOrder(payload))
});

class OrderCloseForm extends Component {
    static propTypes = {
        closeOrder: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        order: PropTypes.object,
        users: PropTypes.array,
        activeUser: PropTypes.object
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

        this.initialValues = {
            closedAt: order.closedAt ? format(order.closedAt, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            closedPrice: order.closedPrice || '',
            ...pick(ORDERS_VALUES, order)
        };
        this.id = prop('id', order);
        this.state = {
            activeUser: activeUser
        };
    }

    getOrderPayload = (
        {
            closedAt,
            closedPrice

        }) => {
        const { activeUser } = this.props;
        return {
            closedAt: +new Date(closedAt),
            closedPrice,
            dirName: this.dirName,
            userId: activeUser.id
        };
    };

    handleSubmit = values => {
        const orderPayload = this.getOrderPayload(values);
        const { closeOrder, onDone } = this.props;

        closeOrder({ ...orderPayload, id: this.id, isClosed: true })
            .then(() => {
                onDone();
            });
    };

    handleChange = (values, changes) => {
        switch (Object.keys(changes)[0]) {
        case 'userId':
            const activeUser = this.props.users.find(user => user.id === changes.userId);
            const { lang } = this.state;

            values.orderId = activeUser.texts[lang].order[0].id;
            break;
        }
    };

    render () {
        return <Form
            initialValues={this.initialValues}
            schema={getSchema({
                data: {
                    title: 'Закрыть ордер',
                    dirName: this.dirName
                }
            })}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
        />;
    }
}

export default connect(null, mapDispatchToProps)(OrderCloseForm);
