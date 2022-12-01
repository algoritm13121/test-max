import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import NewCredentialsForm from '../NewCredentialsForm/NewCredentialsForm.jsx';

import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import amber from '@material-ui/core/colors/amber';
import { withStyles } from '@material-ui/core/styles';

import checkRecoveryToken from '../../../services/checkRecoveryToken';

import { ADMIN_PANEL_URL } from '../../../constants/constants';

const materialStyles = theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    warningBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '110px'
    },
    warning: {
        backgroundColor: amber[700]
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
    checkRecoveryToken: payload => dispatch(checkRecoveryToken(payload))
});

class RecoveryResult extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        checkRecoveryToken: PropTypes.func.isRequired,
        token: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
    };

    static defaultProps = {
        location: {}
    };

    state = {
        loading: true
    };

    componentDidMount () {
        const { token, email } = this.props;

        this.props.checkRecoveryToken({
            token,
            email
        })
            .then(() => {
                this.setState({
                    loading: false,
                    tokenIsValid: true
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    tokenIsValid: false
                });
            });
    }

    redirectToMain = () => {
        window.location.href = ADMIN_PANEL_URL;
    };

    render () {
        const { classes, token, email } = this.props;
        const { loading, tokenIsValid } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        if (tokenIsValid) {
            return <div>
                <Typography variant='h5'>Восстановление учетной записи</Typography>
                <NewCredentialsForm
                    type='recovery'
                    initial={{
                        email
                    }}
                    recovery={{
                        token,
                        email
                    }}
                    onDone={this.redirectToMain}
                />
            </div>;
        }

        return <div className={classes.warningBlock}>
            <SnackbarContent
                className={classNames(classes.warning, classes.margin)}
                message={
                    <span id='client-snackbar' className={classes.message}>
                        <WarningIcon className={classNames(classes.icon, classes.iconVariant)} />
                        Эта ссылка устарела
                    </span>
                }
            />
            <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
                Перейти на главную
            </Button>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(RecoveryResult));
