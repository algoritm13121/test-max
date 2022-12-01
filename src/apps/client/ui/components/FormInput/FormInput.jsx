import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import FormInputList from '../FormInputList/FormInputList';
import styles from './FormInput.css';
import outsideClick from '../../hocs/outsideClick';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

@outsideClick
class FormInput extends Component {
    static propTypes = {
        texts: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        list: PropTypes.array,
        disabled: PropTypes.bool,
        isError: PropTypes.any,
        value: PropTypes.any,
        focus: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        onFocus: PropTypes.func.isRequired,
        onBlur: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        turnOnClickOutside: PropTypes.func,
        lang: PropTypes.string.isRequired,
        type: PropTypes.string,
        activeStyle: PropTypes.bool
    };

    static defaultProps = {
        list: [],
        disabled: false,
        value: ''
    };

    state = {
        isListOpen: false
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.list !== this.props.list || (this.props.disabled ? nextProps.focus !== this.props.focus : nextProps.focus)) {
            this.setState({
                isListOpen: Array.isArray(nextProps.list) && nextProps.focus && nextProps.list.length
            });
        }
    }

    handleCloseList = () => {
        this.setState({
            isListOpen: false
        });
    };

    onClick = () => {
        if (!this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleCloseList);
        }
    };

    disabledClick = name => e => {
        this.setState({
            isListOpen: !this.state.isListOpen
        });

        this.props.onFocus(e, name);
    };

    render () {
        const { texts, name, list, disabled, isError, value, focus, onFocus, onBlur, handleChange, lang, type, activeStyle } = this.props;
        const { isListOpen } = this.state;

        return (
            <div className={classNames(styles.inputWrapper)} onClick={() => this.onClick()}>
                {!disabled
                    ? <input
                        className={classNames(styles.field, { [styles.error]: isError }, { [styles.edit]: focus && value !== '' },
                            { [styles.validate]: !focus && value.length > 0 }, { [styles.activeStyle]: activeStyle }, 'hoverable')}
                        type={type || 'text'}
                        onChange={handleChange(name)}
                        onFocus={onFocus(name)}
                        onBlur={() => onBlur(name)}
                        value={value}
                        name={name}
                        autoComplete="new-password"
                    />
                    : <div
                        className={classNames(
                            styles.field,
                            styles.disabledField,
                            { [styles.open]: focus },
                            { [styles.error]: isError }
                        )}
                        onClick={this.disabledClick(name)}
                        onBlur={() => onBlur(name)}
                    >
                        <span>{value}</span>
                    </div>
                }
                <p className={classNames(styles.whiteText,
                    { [styles.labelEror]: isError },
                    { [styles.validateLabel]: !focus && value.length > 0 },
                    { [styles.positionLabel]: value.length > 0 })}>
                    {texts[name]}
                </p>
                {isError &&
                    <span className={styles.errorUnder}>
                        {texts[`${name}Validator`]}
                    </span>}
                {isListOpen
                    ? <FormInputList
                        name={name}
                        list={list}
                        disabled={disabled}
                        value={value}
                        handleChange={handleChange}
                        lang={lang}
                        styles={styles}
                        handleCloseList={this.handleCloseList}
                    /> : ''}
            </div>
        );
    }
}

export default connect(mapStateToProps)(FormInput);
