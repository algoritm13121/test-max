import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isUndefined from '@tinkoff/utils/is/undefined';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import required from '../Form/validators/required';
import email from '../Form/validators/email';

import pathOr from '@tinkoff/utils/object/pathOr';
import FormInput from '../FormInput/FormInput';
import classNames from 'classnames';

import styles from './AuthFormPopup.css';
import propOr from '@tinkoff/utils/object/propOr';
import ResetPasswordFormPopup from '../ResetPasswordFormPopup/ResetPasswordFormPopup';

import logIn from '../../../services/client/logIn';
import checkAuthentication from '../../../services/client/checkAuthentication';

import setAuthenticationPopup from '../../../actions/setAuthenticationPopup';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    logIn: payload => dispatch(logIn(payload)),
    setAuthenticationPopup: payload => dispatch(setAuthenticationPopup(payload)),
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class AuthFormPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        logIn: PropTypes.func.isRequired,
        setAuthenticationPopup: PropTypes.func.isRequired,
        checkAuthentication: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            ...this.defaultState(),
            isForgetPassword: false,
            isPasswordShown: false
        };
    }

    componentDidUpdate (prevProps) {
        if (prevProps.isVisible !== this.props.isVisible && !this.props.isVisible) {
            this.setState({
                ...this.defaultState(),
                isForgetPassword: false
            });
        }
    }

    defaultState () {
        return {
            email: { value: '', focus: false, isValid: true },
            password: { value: '', focus: false, isValid: true },
            error: null
        };
    };

    handleChange = (name, value) => e => {
        e.stopPropagation();
        const actualValue = isUndefined(value) ? e.target.value : value;

        if (actualValue.length > this.state.maxLength) return;

        this.setState({
            [name]: { ...this.state[name], value: actualValue, focus: isUndefined(value), isValid: true }
        });
    };

    onFocus = name => e => {
        e.stopPropagation();
        this.setState({
            [name]: { ...this.state[name], focus: !this.state[name].focus }
        });
    };

    onBlur = name => {
        const currentState = this.handleCheckErrors([name]);

        this.setState({
            [name]: { ...this.state[name], focus: false, isValid: currentState[name].isValid }
        });
    };

    handleCheckErrors = (names = []) => {
        const thisState = {};

        names.forEach(name => {
            const property = this.state[name];

            if (isObject(property) && !isArray(property)) {
                const value = this.state[name].value;
                let isValid = (
                    name === 'email' ? email(value, { text: false })
                        : required(value, { text: false })) === undefined;

                const newValue = { ...property, isValid };
                thisState[name] = newValue;

                this.setState({
                    [name]: newValue
                });
            }
        });

        return thisState;
    };

    handleSubmit = e => {
        e.preventDefault();

        const { email, password } = this.state;

        const thisState = this.handleCheckErrors(Object.keys(this.state));
        let isValid = true;

        for (let key in thisState) {
            if (!pathOr(['isValid'], true, thisState[key])) {
                isValid = false;
            }
        }

        if (isValid) {
            const credentials = {
                email: email.value.trim(),
                password: password.value.trim()
            };

            this.props.logIn(credentials)
                .then(() => {
                    this.setState({
                        ...this.defaultState(),
                        isForgetPassword: false

                    });
                    this.props.checkAuthentication();
                    this.closePopup();
                })
                .catch((e) => this.setState({ error: e.message }));
        }
    };

    closePopup = () => {
        this.props.setAuthenticationPopup(false);
    };

    handleForgetPassword = () => {
        this.setState({
            isForgetPassword: !this.state.isForgetPassword
        });
    }

    handlerShowPassword = () => {
        this.setState({ isPasswordShown: !this.state.isPasswordShown });
    }

    render () {
        const { langMap } = this.props;
        const { isForgetPassword, isPasswordShown, error } = this.state;
        const text = propOr('auth', {}, langMap);

        return (
            [
                <form key={0} className={classNames(styles.form, {
                    [styles.isPopupHidden]: isForgetPassword
                })} onSubmit={this.handleSubmit}>
                    <div className={styles.emailContainerField}>
                        <FormInput
                            isError={!this.state['email'].isValid}
                            texts={{ email: `${text.inputs.email.placeholder}`, emailValidator: `${text.inputs.email.validator}` }}
                            name='email'
                            type="email"
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.email.value}
                            focus={this.state.email.value}
                        />
                        <div className={classNames(styles.bottomLabel, {
                            [styles.bottomLabelActive]: this.state['email'].isValid
                        })}>{text.isLogin}</div>
                    </div>
                    <div className={styles.passwordContainerField}>
                        <FormInput
                            isError={!this.state['password'].isValid}
                            texts={{ password: `${text.inputs.password.placeholder}`, passwordValidator: `${text.inputs.password.validator}` }}
                            name='password'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.password.value}
                            focus={this.state.password.focus}
                            {...!isPasswordShown && { type: 'password' }}
                        />
                        <img
                            onClick={this.handlerShowPassword}
                            src="/src/apps/client/ui/components/AuthFormPopup/images/password.svg"
                            alt=""
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <button className={classNames(styles.button)} type='submit'>{text.signIn}</button>
                    </div>
                    <div className={styles.forgetPassordButton} onClick={this.handleForgetPassword}>{text.forgetPassword}</div>
                </form>,
                <ResetPasswordFormPopup key={1} isOpen={isForgetPassword} handleBackClick={this.handleForgetPassword} handleClose={this.closePopup} />
            ]
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthFormPopup);
