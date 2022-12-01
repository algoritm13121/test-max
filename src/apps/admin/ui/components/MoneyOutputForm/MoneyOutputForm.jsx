import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getSchema from './MoneyOutputFormSchema';
import editMoneyOutput from '../../../services/editMoneyOutput';
import uniqid from 'uniqid';

const mapDispatchToProps = (dispatch) => ({
    editMoneyOutput: payload => dispatch(editMoneyOutput(payload))
});

const materialStyles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark
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

class MoneyOutputForm extends Component {
    static propTypes = {
        editMoneyOutput: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        onDone: PropTypes.func,
        user: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        user: {}
    };

    constructor (...args) {
        super(...args);

        const { user } = this.props;

        this.dirName = user.dirName || uniqid();
        this.initialValues = {
            name: user.name || '',
            surname: user.surname || '',
            status: user.status || '',
            date: user.date || '',
            amount: user.amount || '',
            id: user.id || ''
        };

        this.id = prop('id', user);
        this.state = {
            errorText: ''
        };
    }
    getOutputPayload = (
        {
            name,
            surname,
            status,
            date,
            amount,
            id

        }) => {
        return {
            name,
            surname,
            status,
            date,
            amount,
            id
        };
    };

    handleSubmit = values => {
        const outputPayload = this.getOutputPayload(values);
        const { editMoneyOutput, onDone } = this.props;

        editMoneyOutput(outputPayload)
            .then(() => {
                onDone();
            })
            .catch(() => {
                this.setState({
                    errorText: 'Что-то пошло не так. Перезагрузите страницы и попробуйте снова'
                });
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes, user } = this.props;
        const { errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                schema={getSchema({
                    data: {
                        title: 'Запрос вывода средств',
                        name: `${user.name} ${user.surname}`,
                        date: user.date,
                        amount: user.amount
                    }
                })}
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
                            {errorText}
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(MoneyOutputForm));
