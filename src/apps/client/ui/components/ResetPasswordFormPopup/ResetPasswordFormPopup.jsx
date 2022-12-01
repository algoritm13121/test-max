import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import noop from '@tinkoff/utils/function/noop';
import pathOr from '@tinkoff/utils/object/pathOr';
import isUndefined from '@tinkoff/utils/is/undefined';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';

import required from '../Form/validators/required';
import email from '../Form/validators/email';
import FormInput from '../FormInput/FormInput';

import styles from './ResetPasswordFormPopup.css';

import sendForm from '../../../services/client/sendForm';
import resetPassword from '../../../services/client/resetPassword';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    sendForm: payload => dispatch(sendForm(payload)),
    resetPassword: payload => dispatch(resetPassword(payload))
});

class ResetPasswordFormPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired,
        handleBackClick: PropTypes.func,
        sendForm: PropTypes.func.isRequired,
        resetPassword: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    };

    static defaultProps = {
        handleBackClick: noop,
        handleClose: noop
    };

    constructor (props) {
        super(props);
        this.state = {
            ...this.defaultState(),
            error: ''
        };
    }

    defaultState () {
        return {
            email: { value: '', focus: false, isValid: true },
            isSubmitted: false
        };
    };

    componentDidUpdate (prevProps) {
        if (this.props.isOpen !== prevProps.isOpen && !this.props.isOpen) {
            this.setState({
                ...this.defaultState()
            });
        }
    }

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

        const { email } = this.state;

        const thisState = this.handleCheckErrors(Object.keys(this.state));
        let isValid = true;

        for (let key in thisState) {
            if (!pathOr(['isValid'], true, thisState[key])) {
                isValid = false;
            }
        }

        if (isValid) {
            const formData = new FormData();

            const credentials = {
                email: email.value,
                password: Math.random().toString(36).slice(2)
            };

            formData.append('values', JSON.stringify(credentials));

            this.props.resetPassword(credentials)
                .then(() => {
                    this.setState({
                        ...this.defaultState(), isSubmitted: true
                    });
                    setTimeout(() => this.closePopup(), 2000);
                })
                .catch(e => {
                    this.setState({ error: e.error });
                });
        }
    };

    closePopup = () => {
        this.handleBackClick();
        this.props.handleClose();
        this.setState({ isSubmitted: false });
    };

    handleBackClick = () => {
        this.props.handleBackClick();
    }

    render () {
        const { langMap, isOpen } = this.props;
        const { isSubmitted, error } = this.state;
        const text = propOr('auth', {}, langMap);

        return (
            <div className={classNames(styles.root, {
                [styles.isPopupHidden]: isOpen
            })}>
                <div className={styles.title}>{text.passwordRevovery}</div>
                <form className={styles.form} onSubmit={this.handleSubmit} >
                    <div className={styles.emailContainerField}>
                        <FormInput
                            isError={!this.state['email'].isValid || error}
                            texts={{ email: `${text.inputs.email.placeholder}`, emailValidator: error || `${text.inputs.email.validator}` }}
                            name='email'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.email.value}
                            focus={this.state.email.value}
                        />
                        <div className={classNames(styles.bottomLabel, {
                            [styles.bottomLabelActive]: !error && this.state['email'].isValid
                        })}>{text.isLogin}</div>
                    </div>
                    <button className={classNames(styles.button)} type='submit'>{text.newPassword}</button>
                    <div className={styles.forgetPassordButton} onClick={this.handleBackClick}>{text.back}</div>
                </form>
                <div className={classNames(styles.successContainer, {
                    [styles.isSuccessPopup]: isSubmitted
                })}>
                    <div className={styles.cover} />
                    <div className={styles.popupWrap}>
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <div className={classNames(styles.content)}>
                                    <div>{text.titleReset}</div>
                                    <img src="/src/apps/client/ui/components/ResetPasswordFormPopup/images/circle.svg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordFormPopup);
