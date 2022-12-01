import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import authenticate from '../../../services/authenticate';
import { ADMIN_PANEL_URL } from '../../../constants/constants';

import styles from './Authentication.css';

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

const mapDispatchToProps = (dispatch) => ({
    authenticate: payload => dispatch(authenticate(payload))
});

class Authentication extends Component {
    static propTypes = {
        authenticate: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired
    };

    state = {
        login: '',
        password: '',
        errors: {
            login: false,
            password: false
        },
        authFailed: false
    };

    handleChange = credential => event => {
        this.setState({
            [credential]: event.target.value,
            errors: {
                ...this.state.errors,
                [credential]: false
            }
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { login, password } = this.state;
        const credentials = {
            login: login.trim(),
            password: password.trim()
        };

        if (!credentials.login || !credentials.password) {
            return this.setState({
                errors: {
                    login: !login,
                    password: !password
                }
            });
        }

        this.props.authenticate(credentials)
            .catch(() => {
                this.setState({
                    password: '',
                    errors: {
                        login: !login,
                        password: !password
                    },
                    authFailed: true
                });
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            authFailed: false
        });
    };

    render () {
        const { classes } = this.props;
        const { login, password, errors, authFailed } = this.state;

        return <div className={styles.container}>
            <h1 className={styles.title}>Вход</h1>
            <form className={styles.form} noValidate autoComplete='off' onSubmit={this.handleSubmit}>
                <TextField
                    label='Логин'
                    value={login}
                    onChange={this.handleChange('login')}
                    margin='normal'
                    variant='outlined'
                    error={errors.login}
                />
                <TextField
                    label='Пароль'
                    value={password}
                    onChange={this.handleChange('password')}
                    margin='normal'
                    variant='outlined'
                    error={errors.password}
                    type='password'
                />
                <div className={styles.button}>
                    <Button variant='contained' color='primary' type='submit' fullWidth>
                        Войти
                    </Button>
                </div>
                <div className={styles.button}>
                    <Button variant='contained' color='default' fullWidth href={`${ADMIN_PANEL_URL}/recovery`}>
                        Забыли пароль?
                    </Button>
                </div>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={authFailed}
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
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(Authentication));
