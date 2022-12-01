import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import format from 'date-fns/format';

import classNames from 'classnames';

import isUndefined from '@tinkoff/utils/is/undefined';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import propOr from '@tinkoff/utils/object/propOr';
import pathOr from '@tinkoff/utils/object/pathOr';

import required from '../Form/validators/required';
import email from '../Form/validators/email';
import phone from '../Form/validators/phone';

import FormInput from '../FormInput/FormInput';

import styles from './RegistrationFormPopup.css';

import saveUser from '../../../services/client/saveUser';
import logIn from '../../../services/client/logIn';

import setAuthenticationPopup from '../../../actions/setAuthenticationPopup';
import checkAuthentication from '../../../services/client/checkAuthentication';

import CountrySelector from '../CountrySelector/CountrySelector';
import { COUNTRY_INFO } from '../../../constants/constants';

const MOBILE_VERRSION = 920;

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        user: data.user,
        mediaWidth: application.media.width
    };
};

const mapDispatchToProps = (dispatch) => ({
    logIn: payload => dispatch(logIn(payload)),
    saveUser: (...payload) => dispatch(saveUser(...payload)),
    setAuthenticationPopup: payload => dispatch(setAuthenticationPopup(payload)),
    checkAuthentication: payload => dispatch(checkAuthentication(payload))
});

class RegistrationFormPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        saveUser: PropTypes.func.isRequired,
        setAuthenticationPopup: PropTypes.func.isRequired,
        logIn: PropTypes.func.isRequired,
        checkAuthentication: PropTypes.func.isRequired,
        user: PropTypes.object,
        mediaWidth: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        langMap: {},
        user: {}
    };

    constructor (props) {
        super(props);
        this.state = {
            ...this.defaultState(),
            isPasswordShown: false,
            error: null,
            activeCountry: this.props.user ? this.props.user.country : COUNTRY_INFO[0]
        };
        this.phoneContainerRef = React.createRef();
        this.callingCodeRef = React.createRef();
    }

    defaultState () {
        return {
            name: { value: '', focus: false, isValid: true },
            surname: { value: '', focus: false, isValid: true },
            email: { value: '', focus: false, isValid: true },
            password: { value: '', focus: false, isValid: true },
            phone: { value: '', focus: false, isValid: true },
            date: { value: null, focus: false, isValid: true },
            confirm: { value: false, focus: false, isValid: true },
            dateInputMaskValue: { value: '', focus: false, isValid: true }
        };
    };

    componentDidMount () {
        this.handleIsMobileVersion();
        this.phoneContainerRef.current.firstChild.firstChild.style.paddingLeft = this.callingCodeRef.current.offsetWidth + 61 + 'px';
    }

    componentDidUpdate (prevProps) {
        if (prevProps.user !== this.props.user && prevProps.user) {
            this.setState({
                ...this.defaultState(),
                activeCountry: COUNTRY_INFO[0],
                error: false
            });
        }

        if (prevProps.isVisible !== this.props.isVisible && !this.props.isVisible) {
            this.setState({
                ...this.defaultState()
            });
        }

        this.handleIsMobileVersion();
        this.phoneContainerRef.current.firstChild.firstChild.style.paddingLeft = this.callingCodeRef.current.offsetWidth + 61 + 'px';
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
                    name === 'phone' ? phone(value, { text: false })
                        : name === 'email' ? email(value, { text: false })
                            : required(value, { text: false })) === undefined;

                if (name === 'date' && !this.state.date.value) {
                    isValid = false;
                }

                if (name === 'password' && !!this.state[name].value.length && this.state[name].value.length < 8) {
                    isValid = false;
                }

                if (
                    name === 'dateInputMaskValue' && this.props.mediaWidth < MOBILE_VERRSION && this.state.dateInputMaskValue.value.includes('_') ||
                    name === 'dateInputMaskValue' && !this.state.dateInputMaskValue.value
                ) {
                    isValid = false;
                }

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

        const { name, surname, email, password, phone, date, confirm, activeCountry } = this.state;

        const thisState = this.handleCheckErrors(Object.keys({
            name,
            surname,
            email,
            password,
            phone,
            date,
            confirm
        }));
        let isValid = true;

        for (let key in thisState) {
            if (!pathOr(['isValid'], true, thisState[key])) {
                isValid = false;
            }
        }

        if (isValid) {
            const user = {
                name: name.value,
                surname: surname.value,
                email: email.value,
                password: password.value,
                phone: phone.value,
                date: this.props.mediaWidth < MOBILE_VERRSION ? date.value : Date.parse(date.value),
                country: activeCountry.name
            };

            const credentials = {
                email: email.value.trim(),
                password: password.value.trim()
            };

            this.props.saveUser(user)
                .then(() => {
                    this.setState({
                        ...this.defaultState()
                    }, () => this.props.logIn(credentials)
                        .then(() => {
                            this.props.checkAuthentication();
                        }));
                    this.closePopup();
                })
                .catch(e => this.setState({ error: e.message }));
        }
    };

    closePopup = () => {
        this.props.setAuthenticationPopup(false);
    };

    handlerCheckBoxClick = type => () => {
        this.setState({
            [type]: { ...this.state[type], value: !this.state[type].value }
        });
    }

    handlerShowPassword = () => {
        this.setState({ isPasswordShown: !this.state.isPasswordShown });
    }

    handleSetCountry = country => {
        this.setState({ activeCountry: country, phone: { ...this.state.phone, value: this.state.phone.value } });
    }

    setInitialDate = () => {
        const dataArr = this.state.date.value.split('.');
        return this.state.date.value ? new Date(dataArr[2], dataArr[1], dataArr[0]) : new Date();
    }

    setStartDate = date => {
        if (this.props.mediaWidth >= MOBILE_VERRSION) {
            this.setState({
                date: { ...this.state.date, value: date, isValid: !!date }
            });
            return;
        }
        this.setState({
            date: { ...this.state.date, value: Date.parse(date) }
        });
    }

    setMobileStartDate = e => {
        const [day, month, year] = e.target.value.split('.').map(i => i.replace(/_/g, ''));
        this.setState({
            date: { ...this.state.date, value: new Date().setFullYear(year, month - 1, day) },
            dateInputMaskValue: { ...this.state.dateInputMaskValue, value: e.target.value }
        });
    }

    getDate = currentDate => {
        if (!currentDate) {
            return;
        }

        const date = new Date(currentDate);

        return format(date, 'dd.MM.yyyy');
    };

    handleIsMobileVersion = () => {
        const { dateInputMaskValue, date } = this.state;

        if (this.props.mediaWidth >= MOBILE_VERRSION && dateInputMaskValue.value) {
            this.setState({
                date: { ...date, value: date.value },
                dateInputMaskValue: { ...dateInputMaskValue, value: '' }
            });
        }

        if (this.props.mediaWidth < MOBILE_VERRSION && !dateInputMaskValue.value) {
            this.setState({
                date: { ...date, value: date.value },
                dateInputMaskValue: { ...dateInputMaskValue, value: this.getDate(date.value) || '__.__.____' }
            });
        }
    }

    render () {
        const { langMap } = this.props;
        const { confirm, isPasswordShown, error, activeCountry } = this.state;
        const text = propOr('auth', {}, langMap);

        return (
            [
                <form key={0} className={styles.form} onSubmit={this.handleSubmit}>
                    <FormInput
                        isError={!this.state['name'].isValid}
                        texts={{ name: `${text.inputs.name.placeholder}`, nameValidator: `${text.inputs.name.validator}` }}
                        name='name'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.name.value}
                        focus={this.state.name.focus}
                    />
                    <FormInput
                        isError={!this.state['surname'].isValid}
                        texts={{ surname: `${text.inputs.surname.placeholder}`, surnameValidator: `${text.inputs.surname.validator}` }}
                        name='surname'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.surname.value}
                        focus={this.state.surname.focus}
                    />
                    <div className={styles.emailContainerField}>
                        <FormInput
                            isError={!this.state['email'].isValid}
                            texts={{ email: `${text.inputs.email.placeholder}`, emailValidator: `${text.inputs.email.validator}` }}
                            name='email'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.email.value}
                            focus={this.state.email.focus}
                            activeStyle={true}
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
                            onMouseDown={this.handlerShowPassword}
                            src="/src/apps/client/ui/components/AuthFormPopup/images/password.svg"
                            alt=""
                        />
                    </div>
                    <div ref={this.phoneContainerRef} className={classNames(styles.phoneContainerField, {
                        [styles.focusPhoneField]: this.state.phone.focus
                    })}>
                        <FormInput
                            isError={!this.state['phone'].isValid}
                            texts={{ phone: `${text.inputs.phone.placeholder}`, phoneValidator: `${text.inputs.phone.validator}` }}
                            name='phone'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.phone.value}
                            focus={this.state.phone.focus}
                        />
                        <div className={styles.originBlock}>
                            <CountrySelector
                                activeCountry={activeCountry}
                                setCountry={this.handleSetCountry}
                                stateCountry={this.state.phone.value}
                            />
                            <div ref={this.callingCodeRef} className={styles.callingCode}>{activeCountry.callingCode}</div>
                        </div>
                    </div>
                    <div className={styles.dateContainerField}>
                        <div className={classNames(styles.dateTitle, {
                            [styles.dateErrorTitle]: !this.state['date'].isValid || !this.state['dateInputMaskValue'].isValid,
                            [styles.dateTitleActive]: this.state['date'].focus ||
                                this.state['date'].value ||
                                this.state['dateInputMaskValue'].focus ||
                                this.state['dateInputMaskValue'].value
                        })}>
                            Дата рождения
                        </div>
                        {this.props.mediaWidth >= MOBILE_VERRSION && <div className={classNames(styles.datePickerContainer, {
                            [styles.dateErrorField]: !this.state['date'].isValid
                        })}>
                            <DatePicker dateFormat="dd.MM.yyyy"
                                selected={this.state.date.value}
                                onChange={date => this.setStartDate(date)}
                                onFocus={this.onFocus('date')}
                                onBlur={() => this.onBlur('date')}
                                maxDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                            />
                        </div>}
                        <InputMask
                            mask="99.99.9999"
                            value={this.state.dateInputMaskValue.value}
                            onFocus={this.onFocus('dateInputMaskValue')}
                            onChange={this.setMobileStartDate}
                            onBlur={() => this.onBlur('dateInputMaskValue')}
                        >
                            {inputProps => <input
                                {...inputProps}
                                className={classNames(styles.mobileMaskDate, {
                                    [styles.mobileMaskDateActive]: this.state.dateInputMaskValue.focus,
                                    [styles.dateTitleActive]: this.state['dateInputMaskValue'].focus || this.state['dateInputMaskValue'].value,
                                    [styles.dateErrorField]: !this.state['dateInputMaskValue'].isValid
                                })}
                                type="text"
                                name='dateMask'
                            />}
                        </InputMask>
                        <img src="/src/apps/client/ui/components/RegistrationFormPopup/images/date.svg" alt="" />
                        <div className={classNames(styles.dateBottomLabel, {
                            [styles.dateBottomLabelActive]: !this.state['date'].isValid || !this.state['dateInputMaskValue'].isValid
                        })}>{text.inputs.date.validator}</div>
                    </div>
                    <div className={styles.checkboxesContainer}>
                        <div onClick={this.handlerCheckBoxClick('confirm')}>
                            <img className={styles.emptyCheck} src="/src/apps/client/ui/components/RegistrationFormPopup/images/empty.png" alt="" />
                            <img className={classNames(styles.fillCheck, {
                                [styles.activeCheckbox]: confirm.value
                            })} src="/src/apps/client/ui/components/RegistrationFormPopup/images/checked.png" alt="" />
                            {text.iAccept}<span>{text.termsOfAgreement}</span>
                        </div>
                        <div className={classNames(styles.checkboxError, {
                            [styles.checkboxErrorActive]: !this.state['confirm'].isValid
                        })}>{text.updates}</div>
                    </div>
                    <div className={styles.buttonContainer}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <button className={classNames(styles.button)} type='submit'>{text.signUp}</button>
                    </div>
                </form>
            ]
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFormPopup);
