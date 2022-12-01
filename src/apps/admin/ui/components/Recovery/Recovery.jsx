import React, { Component } from 'react';
import PropTypes from 'prop-types';

import queryString from 'query-string';

import RecoveryForm from '../RecoveryForm/RecoveryForm.jsx';
import RecoveryResult from '../RecoveryResult/RecoveryResult.jsx';

import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';

const materialStyles = {
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

class Recovery extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { search } } = this.props;
        const query = queryString.parse(search);

        this.recoveryToken = query['recovery-token'];
        this.email = query.email;
    }

    render () {
        const { classes } = this.props;

        return <div className={classes.root}>
            {!this.recoveryToken ? <RecoveryForm /> : <RecoveryResult token={this.recoveryToken} email={this.email} />}
        </div>;
    }
}

export default withRouter(withStyles(materialStyles)(Recovery));
