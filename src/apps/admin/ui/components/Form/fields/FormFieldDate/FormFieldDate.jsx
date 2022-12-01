import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import noop from '@tinkoff/utils/function/noop';

export default class FormFieldDate extends Component {
    static propTypes = {
        value: PropTypes.date,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        validationMessage: PropTypes.string,
        type: PropTypes.string
    };

    static defaultProps = {
        value: new Date(),
        schema: {},
        onChange: noop,
        onBlur: noop,
        validationMessage: '',
        type: 'date'
    };

    handleChange = event => {
        event.preventDefault();

        this.props.onChange(event.target.value);
    };

    render () {
        const { value, validationMessage, schema, type } = this.props;

        return <TextField
            label={schema.label}
            value={value}
            onChange={this.handleChange}
            onBlur={this.props.onBlur}
            error={!!validationMessage}
            margin='normal'
            variant='outlined'
            type={type}
            InputLabelProps={{
                shrink: true
            }}
        />;
    }
}
