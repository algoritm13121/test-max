import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core';

import getToken from '../../../services/getToken';
import saveToken from '../../../services/saveToken';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import format from 'date-fns/format';

const materialStyles = theme => ({
    content: {
        width: '100%',
        padding: theme.spacing(1)
    },
    input: {
        width: '200px'
    }
});

const mapDispatchToProps = dispatch => ({
    getToken: payload => dispatch(getToken(payload)),
    saveToken: payload => dispatch(saveToken(payload))
});

class RefreshApiToken extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        saveToken: PropTypes.func.isRequired,
        getToken: PropTypes.func.isRequired
    };

    state = {
        tokenInfo: null,
        value: ''
    };

    componentDidMount () {
        this.props.getToken()
            .then((tokenInfo) => {
                tokenInfo && this.setState({ tokenInfo });
            });
    }

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    };

    handleSubmit = () => {
        const { value } = this.state;

        this.props.saveToken(value)
            .then(() => {
                this.setState({
                    value: ''
                });
                this.props.getToken()
                    .then((tokenInfo) => {
                        tokenInfo && this.setState({ tokenInfo });
                    });
            });
    };

    render () {
        const { classes } = this.props;
        const { value, tokenInfo } = this.state;

        return <div className={classes.content}>
            {tokenInfo && <Typography>
                Токен - <Box display='inline' fontWeight="fontWeightBold">"{tokenInfo.token}"</Box>,
                загружен в {format(tokenInfo.createdAt, 'mm:kk')} {format(tokenInfo.createdAt, 'dd.MM.yyyy')}
            </Typography>}
            <TextField className={classes.input} onChange={this.handleChange} value={value} />
            <Button onClick={this.handleSubmit}>Обновить</Button>
        </div>;
    }
}

export default connect(undefined, mapDispatchToProps)(withStyles(materialStyles)(RefreshApiToken));
