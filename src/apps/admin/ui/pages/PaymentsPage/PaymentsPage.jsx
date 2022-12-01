import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './PaymentsPage.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import updatePayments from '../../../services/updatePayment';
import getPayments from '../../../services/getPaymentsRequisites';

const materialStyles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    successBlock: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        bottom: '0px',
        right: '15px',
        height: '110px'
    },
    success: {
        backgroundColor: green[600]
    },
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

const mapDispatchToProps = (dispatch) => ({
    updatePayments: payload => dispatch(updatePayments(payload)),
    getPayments: payload => dispatch(getPayments(payload))
});

class PaymentsPage extends Component {
    static propTypes = {
        classes: PropTypes.object,
        updatePayments: PropTypes.func.isRequired,
        getPayments: PropTypes.func.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            qiwi: '',
            bitcoin: '',
            gateway: '',
            success: false
        };
    }

    componentDidMount () {
        this.props.getPayments().then(
            payments => this.setState({
                qiwi: payments[0].qiwi,
                bitcoin: payments[0].bitcoin,
                gateway: payments[0].gateway
            })
        );
    }

    handleSubmit = () => {
        const data = {
            qiwi: this.state.qiwi,
            bitcoin: this.state.bitcoin,
            gateway: this.state.gateway
        };

        this.props.updatePayments(data)
            .then(() => this.setState({
                success: true
            }));
    }

    handleChange = (field) => event => {
        this.setState({
            [field]: event.target.value
        });
    }
    render () {
        const { classes } = this.props;
        const { qiwi, bitcoin, gateway, success } = this.state;

        return <div className={styles.root}>
            <div className={styles.row}>
                <label className={styles.label} >
                    QIWI:
                </label>
                <input className={styles.input} type="text" value={qiwi} onChange={this.handleChange('qiwi')} />
            </div>
            <div className={styles.row}>
                <label className={styles.label} >
                    BTC:
                </label>
                <input className={styles.input} type="text" value={bitcoin} onChange={this.handleChange('bitcoin')} />
            </div>
            <div className={styles.row}>
                <label className={styles.label} >
                    Portmone:
                </label>
                <input className={styles.input} type="text" value={gateway} onChange={this.handleChange('gateway')} />
            </div>
            <button className={styles.button} onClick={this.handleSubmit}>Сохранить</button>
            {success
                ? <div className={classes.successBlock}>
                    <SnackbarContent
                        className={classNames(classes.success, classes.margin)}
                        message={
                            <span id='client-snackbar' className={classes.message}>
                                <CheckCircleIcon className={classNames(classes.icon, classes.iconVariant)} />
                                Смена реквизитов успешна
                            </span>
                        }
                    />
                </div> : undefined
            }
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(PaymentsPage));
