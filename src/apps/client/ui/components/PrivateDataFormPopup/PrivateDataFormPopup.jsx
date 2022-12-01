import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import format from 'date-fns/format';

import classNames from 'classnames';
import styles from './PrivateDataFormPopup.css';

import isUndefined from '@tinkoff/utils/is/undefined';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import pathOr from '@tinkoff/utils/object/pathOr';
import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';
import noop from '@tinkoff/utils/function/noop';
import isNull from '@tinkoff/utils/is/nil';
import includes from '@tinkoff/utils/array/includes';

import required from '../Form/validators/required';
import email from '../Form/validators/email';
import phone from '../Form/validators/phone';
import FormInput from '../FormInput/FormInput';
import CountrySelector from '../CountrySelector/CountrySelector';

import outsideClick from '../../hocs/outsideClick.jsx';

import setAccountInfoPopup from '../../../actions/setAccountInfoPopup';
import editUser from '../../../services/client/editUser';

import { COUNTRY_INFO } from '../../../constants/constants';

const MOBILE_VERRSION = 920;
const GENDER = [
    { id: 1, name: 'male' },
    { id: 2, name: 'female' }
];

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        user: data.user,
        mediaWidth: application.media.width
    };
};

const mapDispatchToProps = (dispatch) => ({
    setAccountInfoPopup: payload => dispatch(setAccountInfoPopup(payload)),
    editUser: payload => dispatch(editUser(payload))
});

@outsideClick
class PrivateDataFormPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        user: PropTypes.object,
        updateField: PropTypes.func,
        editUser: PropTypes.func.isRequired,
        setAccountInfoPopup: PropTypes.func.isRequired,
        isVisible: PropTypes.bool,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        mediaWidth: PropTypes.number.isRequired
    };

    static defaultProps = {
        updateField: noop,
        user: {}
    };

    constructor (props) {
        super(props);
        this.state = {
            ...this.defaultState(),
            isForgetPassword: false,
            isGenderOpen: false,
            activeGender: '',
            activeCountry: this.props.user ? this.props.user.country : COUNTRY_INFO[0],
            isSuccesPopupShow: false
        };

        this.form = React.createRef();
        this.callingCodeRef = React.createRef();
        this.phoneContainerRef = React.createRef();
    }

    componentDidMount () {
        this.handleIsMobileVersion();
    }

    componentDidUpdate (prevProps, prevState) {
        const { outsideClickEnabled } = this.props;

        if (prevProps.user !== this.props.user && this.props.user || (prevProps.isVisible !== this.props.isVisible && this.props.isVisible)) {
            for (const key in this.props.user) {
                this.handleChange(key, this.props.user[key])();
            }

            this.setState({
                activeGender: this.props.user.gender || '',
                activeCountry: find(country => country.name === this.props.user.country, COUNTRY_INFO) || this.props.user.country
            });
        }

        if (this.state.isGenderOpen !== prevState.isGenderOpen && !this.state.isGenderOpen && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleGenderClick);
        }

        this.handleIsMobileVersion();
        this.phoneContainerRef.current.firstChild.firstChild.style.paddingLeft = this.callingCodeRef.current.offsetWidth + 15 + 'px';
    }

    defaultState () {
        const { user } = this.props;

        return {
            gender: { value: user && user.gender || '', focus: false, isValid: true },
            date: { value: user && new Date(user.date) || '', focus: false, isValid: true },
            phone: { value: user && user.phone || '', focus: false, isValid: true },
            country: { value: user && user.country || COUNTRY_INFO[0].name, focus: false, isValid: true },
            city: { value: user && user.city || '', focus: false, isValid: true },
            address: { value: user && user.address || '', focus: false, isValid: true },
            accountNumber: { value: user && user.accountNumber || '', focus: false, isValid: true },
            email: { value: user && user.email || '', focus: false, isValid: true },
            newPassword: { value: '', focus: false, isValid: true },
            confirmPassword: { value: '', focus: false, isValid: true },
            dateInputMaskValue: { value: '', focus: false, isValid: true },
            isSubmitted: false,
            error: ''
        };
    };

    handleChange = (name, value) => e => {
        if (e) e.stopPropagation();
        const actualValue = isUndefined(value) || isNull(value) ? e.target.value : value;

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
                let value = this.state[name].value;
                if (name === 'phone' && value.includes(this.state.activeCountry.callingCode)) {
                    value = value.replace(this.state.activeCountry.callingCode, '');
                }

                let isValid = (
                    name === 'phone' ? phone(value, { text: false })
                        : name === 'email' ? email(value, { text: false })
                            : required(value, { text: false })) === undefined;

                if (name === 'newPassword' && !this.state['newPassword'].value.length) {
                    isValid = true;
                }

                if (name === 'newPassword' && !!this.state['newPassword'].value.length && this.state[name].value.length < 8) {
                    isValid = false;
                }

                if (name === 'confirmPassword') {
                    isValid = true;
                }

                if (name === 'confirmPassword' && this.state.confirmPassword.value !== this.state.newPassword.value) {
                    isValid = false;
                }

                if (name === 'dateInputMaskValue' && this.props.mediaWidth < MOBILE_VERRSION && this.state.dateInputMaskValue.value.includes('_')) {
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

        const { name, surname, email, phone, date, city, address, gender, country, accountNumber, newPassword, confirmPassword } = this.state;

        const thisState = this.handleCheckErrors(Object.keys({
            name,
            surname,
            email,
            phone,
            date,
            city,
            address,
            gender,
            country,
            accountNumber,
            newPassword,
            confirmPassword
        }));
        let isValid = true;

        for (let key in thisState) {
            if (!pathOr(['isValid'], true, thisState[key])) {
                isValid = false;
            }
        }

        if (isValid) {
            let personalInfo = {
                name: name.value,
                surname: surname.value,
                email: email.value,
                phone: phone.value,
                date: date.value,
                city: city.value,
                address: address.value,
                gender: gender.value,
                country: country.value,
                accountNumber: accountNumber.value,
                id: this.props.user.id
            };

            if (newPassword.value === confirmPassword.value && !!newPassword.value.length) {
                personalInfo = { ...personalInfo, password: newPassword.value };
            }

            this.props.editUser(personalInfo)
                .then(() => {
                    this.setState({
                        newPassword: { ...newPassword, value: '', focus: false, isValid: true },
                        confirmPassword: { ...confirmPassword, value: '', focus: false, isValid: true },
                        isSubmitted: true,
                        isSuccesPopupShow: true
                    });
                    setTimeout(() => {
                        this.props.setAccountInfoPopup();
                        this.setState({
                            isSuccesPopupShow: false
                        });
                    }, 2000);
                })
                .catch(e => {
                    this.setState({ error: e.error });
                });
        } else {
            this.form.current.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
    };

    handleForgetPassword = () => {
        this.setState({
            isForgetPassword: !this.state.isForgetPassword
        });
    }

    handlerShowPassword = field => () => {
        this.setState({ [field]: !this.state[field] });
    }

    handleClearPassword = () => {
        this.setState({
            gender: { value: '', focus: false, isValid: true },
            date: { value: Date.now(), focus: false, isValid: true },
            phone: { value: '', focus: false, isValid: true },
            country: { value: COUNTRY_INFO[0].name, focus: false, isValid: true },
            city: { value: '', focus: false, isValid: true },
            address: { value: '', focus: false, isValid: true },
            email: { value: '', focus: false, isValid: true },
            newPassword: { value: '', focus: false, isValid: true },
            confirmPassword: { value: '', focus: false, isValid: true },
            dateInputMaskValue: { value: '', focus: false, isValid: true },
            activeGender: ''
        });
    }

    handleGenderClick = () => {
        this.setState({ isGenderOpen: !this.state.isGenderOpen });
    }

    handlerSetGender = gender => () => {
        this.setState({ activeGender: gender, gender: { isValid: true, value: gender } });
    }

    handleSetCountry = country => {
        this.setState({ activeCountry: country, country: { ...this.state.country, value: country.name } });
        this.phoneContainerRef.current.firstChild.firstChild.style.paddingLeft = this.callingCodeRef.current.offsetWidth + 13 + 4 + 'px';
    }

    setStartDate = date => {
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

        if (this.props.mediaWidth < MOBILE_VERRSION && !dateInputMaskValue.value && date.value) {
            this.setState({
                dateInputMaskValue: { ...dateInputMaskValue, value: this.getDate(date.value) }
            });
        } else if (this.props.mediaWidth >= MOBILE_VERRSION && dateInputMaskValue.value) {
            this.setState({
                date: { ...date, value: date.value },
                dateInputMaskValue: { ...dateInputMaskValue, value: '' }
            });
        }
    }

    formatPhone = (phone, callingCode) => {
        if (phone.includes(callingCode)) {
            return phone.replace(callingCode, '');
        }
        return phone;
    }

    render () {
        const { langMap, user } = this.props;
        const { isForgetPassword, error, isNewPasswordShown, isConfirmPasswordShown,
            isGenderOpen, activeGender, activeCountry, isSuccesPopupShow } = this.state;
        const text = propOr('auth', {}, langMap);
        const textDataInfo = propOr('accountInfo', {}, langMap);
        const genderTitle = activeGender ? textDataInfo.dataInfo.gender[activeGender] : '';

        return <div className={styles.privateDataContainer} ref={this.form}>
            <div className={styles.mainDataContainer}>
                <div className={styles.avatarContainer}>
                    <img src="/src/apps/client/ui/components/PrivateDataFormPopup/images/avatar.png" alt="avatar" />
                    {user && user.accountStatus && <img
                        className={styles.wreath}
                        src={`/src/apps/client/ui/components/AuthorizationPanel/images/${user && user.accountStatus}.svg`}
                        alt="wreath"
                    />}
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.personName}>{user && user.name} {user && user.surname}</div>
                    { user && user.accountStatus && <div className={classNames(styles.personStatus, {
                        [styles.goldStatus]: user && user.accountStatus === 'gold',
                        [styles.platinumStatus]: user && user.accountStatus === 'platinum',
                        [styles.diamondStatus]: user && user.accountStatus === 'diamond',
                        [styles.vipStatus]: user && user.accountStatus === 'vip'
                    })}>{user && user.accountStatus}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M8 0.125C3.65117 0.125 0.125 3.65117 0.125 8C0.125 12.3488 3.65117 15.875 8 15.875C12.3488 15.875 15.875 12.3488 15.875 8C15.875 3.65117 12.3488 0.125 8 0.125ZM8.5625 11.7969C8.5625 11.8742 8.49922 11.9375 8.42188 11.9375H7.57812C7.50078 11.9375 7.4375 11.8742 7.4375 11.7969V7.01562C7.4375 6.93828 7.50078 6.875 7.57812 6.875H8.42188C8.49922 6.875 8.5625 6.93828 8.5625 7.01562V11.7969ZM8 5.75C7.77921 5.74549 7.56897 5.65462 7.41442 5.49687C7.25986 5.33913 7.1733 5.12709 7.1733 4.90625C7.1733 4.68541 7.25986 4.47337 7.41442 4.31563C7.56897 4.15788 7.77921 4.06701 8 4.0625C8.22079 4.06701 8.43102 4.15788 8.58558 4.31563C8.74014 4.47337 8.8267 4.68541 8.8267 4.90625C8.8267 5.12709 8.74014 5.33913 8.58558 5.49687C8.43102 5.65462 8.22079 5.74549 8 5.75Z" fill="#A6B1DC" fillOpacity="0.5" />
                        </svg>
                    </div>}
                    <div className={styles.hash}>#{user && user.accountNumber}</div>
                </div>
            </div>
            <form className={classNames(styles.form, {
                [styles.isPopupHidden]: isForgetPassword
            })} onSubmit={this.handleSubmit}>
                <div className={styles.genderContainerField} onClick={this.handleGenderClick}>
                    <div className={styles.genderFormFieldContainer}>
                        <FormInput
                            isError={!this.state['gender'].isValid}
                            texts={{ gender: `${text.inputs.gender.placeholder}`, genderValidator: `${text.inputs.gender.validator}` }}
                            name='gender'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.gender.value}
                            focus={this.state.gender.focus}
                        />
                    </div>
                    <div className={styles.genderSelect}>
                        <div className={styles.currentGenderTitle}>{genderTitle}</div>
                        <div className={classNames(styles.innerGenderContainer, {
                            [styles.innerGenderContainerOpen]: isGenderOpen
                        })}>
                            {GENDER
                                .filter(item => item.name !== activeGender)
                                .map(item => <div key={item.id} className={styles.genderContainer} onClick={this.handlerSetGender(item.name)}>
                                    {textDataInfo.dataInfo.gender[item.name]}
                                </div>)}
                        </div>
                    </div>
                    <img className={classNames({
                        [styles.rotateImg]: isGenderOpen
                    })} src="/src/apps/client/ui/components/PrivateDataFormPopup/images/arrowDown.svg" alt="" />
                </div>
                <div className={styles.birthDateContainerField}>
                    <div className={styles.birthDateContainerFormInput}>
                        <FormInput
                            isError={!this.state['date'].isValid || !this.state['dateInputMaskValue'].isValid}
                            texts={{ date: `${text.inputs.date.placeholder}`, dateValidator: `${text.inputs.date.validator}` }}
                            name='date'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            handleChange={this.handleChange}
                            value={this.state.date.value}
                            focus={this.state.date.focus}
                        />
                    </div>
                    {this.props.mediaWidth >= MOBILE_VERRSION && <div className={classNames(styles.datePickerContainer)}>
                        <DatePicker
                            dateFormat="dd.MM.yyyy"
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
                        onChange={this.setMobileStartDate}
                        onFocus={this.onFocus('dateInputMaskValue')}
                        onBlur={() => this.onBlur('dateInputMaskValue')}
                    >
                        {inputProps => <input
                            {...inputProps}
                            className={classNames(styles.mobileMaskDate, {
                                [styles.mobileMaskDateActive]: this.state.dateInputMaskValue.focus
                            })}
                            type="text"
                            name='dateMask'
                        />}
                    </InputMask>
                    <img src="/src/apps/client/ui/components/PrivateDataFormPopup/images/date.svg" alt="" />
                </div>
                <div ref={this.phoneContainerRef} className={classNames(styles.phoneContainerField, {
                    [styles.phoneInputActive]: this.state.phone.focus
                })}>
                    {/* <InputMask */}
                    {/*    mask={activeCountry.callingCode} */}
                    {/*    maskChar=" " */}
                    {/*    texts={{ phone: `${text.inputs.phone.placeholder}`, phoneValidator: `${text.inputs.phone.validator}` }} */}
                    {/*    name='phone' */}
                    {/*    onFocus={this.onFocus} */}
                    {/*    onBlur={this.onBlur} */}
                    {/*    handleChange={this.handleChange} */}
                    {/*    value={this.formatPhone(this.state.phone.value, activeCountry.name)} */}
                    {/*    focus={this.state.phone.focus} */}
                    {/* /> */}

                    <FormInput
                        isError={!this.state['phone'].isValid}
                        texts={{ phone: `${text.inputs.phone.placeholder}`, phoneValidator: `${text.inputs.phone.validator}` }}
                        name='phone'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.formatPhone(this.state.phone.value, activeCountry.callingCode)}
                        focus={this.state.phone.focus}
                    />
                    <div ref={this.callingCodeRef} className={styles.callingCode}>{activeCountry.callingCode}</div>
                </div>
                <div className={styles.countryContainerField} onClick={this.handleCountryClick}>
                    <CountrySelector
                        activeCountry={activeCountry}
                        setCountry={this.handleSetCountry}
                        stateCountry={this.state.country.value}
                        title={textDataInfo.countryInfo[activeCountry.name]}
                    />
                    <div className={styles.topLabel}>{text.inputs.country.placeholder}</div>
                </div>
                <div className={styles.cityContainerField}>
                    <FormInput
                        isError={!this.state['city'].isValid}
                        texts={{ city: `${text.inputs.city.placeholder}`, cityValidator: `${text.inputs.city.validator}` }}
                        name='city'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.city.value}
                        focus={this.state.city.focus}
                    />
                </div>
                <div className={styles.addressContainerField}>
                    <FormInput
                        isError={!this.state['address'].isValid}
                        texts={{ address: `${text.inputs.address.placeholder}`, addressValidator: `${text.inputs.address.validator}` }}
                        name='address'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.address.value}
                        focus={this.state.address.focus}
                    />
                    <div className={classNames(styles.bottomLabel, {
                        [styles.bottomLabelActive]: this.state['address'].isValid
                    })}>{text.addressBotomLabel}</div>
                </div>
                <div className={styles.accountNumberContainerField}>
                    <FormInput
                        isError={!this.state['accountNumber'].isValid}
                        texts={{ accountNumber: `${text.inputs.accountNumber.placeholder}`, accountNumberValidator: `${text.inputs.accountNumber.validator}` }}
                        name='accountNumber'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.accountNumber.value}
                        focus={this.state.accountNumber.value}
                    />
                </div>
                <div className={styles.emailContainerField}>
                    <FormInput
                        isError={!this.state['email'].isValid}
                        texts={{ email: `${text.inputs.email.placeholder}`, emailValidator: `${text.inputs.email.validator}` }}
                        name='email'
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
                <div className={styles.emptyContainerField}></div>
                <div className={styles.passwordLine}></div>
                <div className={styles.newPasswordContainerField}>
                    <FormInput
                        isError={!this.state['newPassword'].isValid}
                        texts={{ newPassword: `${text.inputs.newPassword.placeholder}`, newPasswordValidator: `` }}
                        name='newPassword'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.newPassword.value}
                        focus={this.state.newPassword.value}
                        {...!isNewPasswordShown && { type: 'password' }}
                    />
                    <img
                        onClick={this.handlerShowPassword('isNewPasswordShown')}
                        src="/src/apps/client/ui/components/PrivateDataFormPopup/images/password.svg"
                        alt=""
                    />
                    <div className={classNames(styles.bottomLabel, styles.bottomPasswordLabel, {
                        [styles.errorBottomLabel]: !this.state['newPassword'].isValid
                    })}>Минимум 8 символов</div>
                </div>
                <div className={styles.confirmPasswordContainerField}>
                    <FormInput
                        isError={!this.state['confirmPassword'].isValid}
                        texts={{
                            confirmPassword: `${text.inputs.confirmPassword.placeholder}`,
                            confirmPasswordValidator: `${error || text.inputs.confirmPassword.validator}`
                        }}
                        name='confirmPassword'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        handleChange={this.handleChange}
                        value={this.state.confirmPassword.value}
                        focus={this.state.confirmPassword.value}
                        {...!isConfirmPasswordShown && { type: 'password' }}
                    />
                    <img
                        onClick={this.handlerShowPassword('isConfirmPasswordShown')}
                        src="/src/apps/client/ui/components/PrivateDataFormPopup/images/password.svg"
                        alt=""
                    />
                </div>
                <div className={styles.clearPasswords} onClick={this.handleClearPassword}>{text.clear}</div>
                <div className={styles.buttonContainer}>
                    <button className={styles.button} type='submit'>{text.save}</button>
                </div>
            </form>
            <div className={classNames(styles.successPopup, { [styles.active]: isSuccesPopupShow })}>
                <p className={styles.successPopupTitle}>Сохранение успешно</p>
                <img src="/src/apps/client/ui/components/PrivateDataFormPopup/images/successIcon.png" alt=""/>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateDataFormPopup);
