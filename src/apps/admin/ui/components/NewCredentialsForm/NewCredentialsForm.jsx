import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import noop from '@tinkoff/utils/function/noop';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import changeCredentials from '../../../services/changeCredentials';
import changeRecoveryCredentials from '../../../services/changeRecoveryCredentials';

const EMAIL_PATTERN = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex, no-useless-escape, max-len

const materialStyles = {
    form: {
        width: '400px'
    },
    errorPoint: {
        marginTop: '10px',
        fontSize: '14px'
    }
};

const mapDispatchToProps = (dispatch) => ({
    changeCredentials: (...payload) => dispatch(changeCredentials(...payload)),
    changeRecoveryCredentials: (...payload) => dispatch(changeRecoveryCredentials(...payload))
});

class NewCredentialsForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        type: PropTypes.oneOf(['authentication', 'recovery']).isRequired,
        changeCredentials: PropTypes.func.isRequired,
        changeRecoveryCredentials: PropTypes.func.isRequired,
        authentication: PropTypes.object,
        recovery: PropTypes.object,
        initial: PropTypes.object,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop,
        authentication: {},
        recovery: {},
        initial: {}
    };

    constructor (...args) {
        super(...args);

        const { initial: { email, login } } = this.props;

        this.state = {
            email: email || '',
            login: login || '',
            password: '',
            password2: '',
            errors: []
        };
    }

    changeCredentials = newCredentials => {
        switch (this.props.type) {
        case 'authentication':
            return this.props.changeCredentials({
                oldCredentials: this.props.authentication,
                newCredentials
            });
        case 'recovery':
            return this.props.changeRecoveryCredentials({
                recovery: this.props.recovery,
                newCredentials
            });
        }
    };

    newCredentialsValidators = [
        ({ login }) => /[а-яА-Я]/g.test(login) ? 'Логин не должен содержать кириллицу' : null,
        ({ login }) => / /g.test(login) ? 'Логин не должен содержать пробелов' : null,
        ({ password }) => password.length >= 8 ? null : 'Длина пароля должна быть не меньше восьми',
        ({ password }) => /[а-яА-Я]/g.test(password) ? 'Пароль не должен содержать кириллицу' : null,
        ({ password }) => / /g.test(password) ? 'Пароль не должен содержать пробелов' : null,
        ({ password }) => /[0-9]/g.test(password) ? null : 'В пароле должны использоваться цифры',
        ({ password, password2 }) => password === password2 ? null : 'Пароли должны совпадать',
        ({ email }) => EMAIL_PATTERN.test(email) ? null : 'Введите валидный имейл'
    ];

    validateCredentials = credentials => {
        const errors = [];

        this.newCredentialsValidators.forEach(validator => {
            const error = validator(credentials);

            error && errors.push(error);
        });

        return errors;
    };

    handleSubmit = event => {
        event.preventDefault();

        const { login, password, password2, email } = this.state;
        const newCredentials = {
            login: login.trim(),
            password: password.trim(),
            email: email.trim()
        };
        const errors = this.validateCredentials({
            ...newCredentials,
            password2: password2.trim()
        });

        this.setState({
            errors: errors
        });

        if (errors.length) {
            return;
        }

        this.changeCredentials(newCredentials)
            .then(() => {
                this.props.onDone();
            })
            .catch(() => {
                this.setState({
                    authentication: {
                        login,
                        password: '',
                        password2: ''
                    }
                });
            });
    };

    handleChange = credential => event => {
        this.setState({
            [credential]: event.target.value
        });
    };

    render () {
        const { classes } = this.props;
        const { login, password, password2, email, errors } = this.state;

        return <div>
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <TextField
                    label='Email'
                    value={email}
                    onChange={this.handleChange('email')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!email
                    }}
                />
                <TextField
                    label='Логин'
                    value={login}
                    onChange={this.handleChange('login')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{
                        shrink: !!login
                    }}
                    required
                />
                <TextField
                    label='Пароль'
                    value={password}
                    onChange={this.handleChange('password')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!password
                    }}
                    type='password'
                />
                <TextField
                    label='Повторите пароль'
                    value={password2}
                    onChange={this.handleChange('password2')}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: !!password2
                    }}
                    type='password'
                />
                <Button variant='contained' color='primary' type='submit' fullWidth>
                    Сменить
                </Button>
                { errors.map((error, i) => <Typography className={classes.errorPoint} color='error' key={i}>&bull; {error}</Typography>) }
            </form>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(NewCredentialsForm));
