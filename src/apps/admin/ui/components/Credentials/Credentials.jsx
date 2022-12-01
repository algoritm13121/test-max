import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';

import NewCredentialsForm from '../NewCredentialsForm/NewCredentialsForm.jsx';

import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import logout from '../../../services/logout';
import authenticate from '../../../services/authenticate';
import { ADMIN_PANEL_URL } from '../../../constants/constants';

const materialStyles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)'
    },
    container: {
        width: '500px',
        marginTop: '-40px'
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        width: '400px'
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
    logout: payload => dispatch(logout(payload)),
    authenticate: payload => dispatch(authenticate(payload))
});

class Credentials extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        authenticate: PropTypes.func.isRequired
    };

    static defaultProps = {};

    state = {
        authentication: {
            login: '',
            password: ''
        },
        user: {},
        activeStep: 0,
        authFailed: false,
        newCredentialsErrors: []
    };

    getSteps = () => [
        'Аутентификация',
        'Изменение учетных данных'
    ];

    getContentByStep = activeStep => {
        switch (activeStep) {
        case 0:
            return this.renderAuthenticationForm();
        case 1:
            return <NewCredentialsForm
                type='authentication'
                initial={{
                    email: this.state.user.email,
                    login: this.state.user.login
                }}
                authentication={this.state.authentication}
                onDone={this.handleNewCredentialsDone}
            />;
        }
    };

    handleNewCredentialsDone = () => {
        this.props.logout();

        this.props.history.push(ADMIN_PANEL_URL);
    };

    handleAuthenticationChange = credential => event => {
        this.setState({
            authentication: {
                ...this.state.authentication,
                [credential]: event.target.value
            }
        });
    };

    handleAuthenticationSubmit = event => {
        event.preventDefault();

        const { login, password } = this.state.authentication;

        const credentials = {
            login: login.trim(),
            password: password.trim()
        };

        this.props.authenticate(credentials)
            .then(({ user }) => {
                this.setState({
                    activeStep: 1,
                    user: {
                        login: user.login,
                        email: user.email
                    }
                });
            })
            .catch(() => {
                this.setState({
                    authentication: {
                        login,
                        password: ''
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

    renderAuthenticationForm = () => {
        const { classes } = this.props;
        const { authentication, authFailed } = this.state;

        return <div>
            <form className={classes.form} onSubmit={this.handleAuthenticationSubmit}>
                <TextField
                    label='Логин'
                    value={authentication.login}
                    onChange={this.handleAuthenticationChange('login')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{
                        shrink: !!authentication.login
                    }}
                    required
                />
                <TextField
                    label='Пароль'
                    value={authentication.password}
                    onChange={this.handleAuthenticationChange('password')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!authentication.password
                    }}
                    type='password'
                />
                <Button variant='contained' color='primary' type='submit' fullWidth>
                    Войти
                </Button>
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
    };

    render () {
        const { classes } = this.props;
        const { activeStep } = this.state;
        const steps = this.getSteps();

        return <div className={classes.root}>
            <div className={classes.container}>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel completed={index < activeStep}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className={classes.content}>
                    {this.getContentByStep(activeStep)}
                </div>
            </div>
        </div>;
    }
}

export default withRouter(connect(null, mapDispatchToProps)(withStyles(materialStyles)(Credentials)));
