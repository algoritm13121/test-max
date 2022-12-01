import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

import recover from '../../../services/recover';

import { ADMIN_PANEL_URL } from '../../../constants/constants';

const materialStyles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    successBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    recover: payload => dispatch(recover(payload))
});

class RecoveryForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        recover: PropTypes.func.isRequired
    };

    state = {
        email: '',
        wrongEmail: false,
        success: false
    };

    handleChange = credential => event => {
        this.setState({
            [credential]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { email } = this.state;

        this.props.recover(email)
            .then(() => this.setState({
                success: true
            }))
            .catch(() => this.setState({
                wrongEmail: true
            }));
    };

    handleHideFailMessage = () => {
        this.setState({
            wrongEmail: false
        });
    };

    render () {
        const { classes } = this.props;
        const { email, wrongEmail, success } = this.state;

        if (success) {
            return <div className={classes.successBlock}>
                <SnackbarContent
                    className={classNames(classes.success, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <CheckCircleIcon className={classNames(classes.icon, classes.iconVariant)} />
                            Проверьте почту
                        </span>
                    }
                />
                <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
                    Перейти на главную
                </Button>
            </div>;
        }

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>Восстановление учетной записи</Typography>
            <TextField
                label='Email'
                value={email}
                onChange={this.handleChange('email')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <div className={classes.buttons}>
                <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
                    Перейти на главную
                </Button>
                <Button variant='contained' color='primary' type='submit'>
                    Восстановить
                </Button>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={wrongEmail}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            Вы ввели неправильный логин или пароль
                        </span>
                    }
                />
            </Snackbar>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(RecoveryForm));
