import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../client/vendor';
import '../../css/main.css';

import { connect } from 'react-redux';

import checkAuthentication from './services/checkAuthentication';
import getUnvisitedMoneyOutput from './services/getUnvisitedMoneyOutput';
import getUnvisitedMessageHistory from './services/getUnvisitedMessageHistory';

import { Switch, Route, withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';

import messageWebsocketController from './services/messageWebsocket';
import outputWebsocketController from './services/outputWebsocket';

import QiwiPage from './ui/pages/QiwiPage/QiwiPage.jsx';
import ChatPage from './ui/pages/ChatPage/ChatPage.jsx';
import Header from './ui/components/Header/Header.jsx';
import Authentication from './ui/components/Authentication/Authentication.jsx';
import Recovery from './ui/components/Recovery/Recovery.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import CredentialsPage from './ui/pages/CredentialsPage/CredentialsPage.jsx';
import DatabasePage from './ui/pages/DatabasePage/DatabasePage.jsx';
import UsersPage from './ui/pages/UsersPage/UsersPage.jsx';
import PaymentsPage from './ui/pages/PaymentsPage/PaymentsPage.jsx';
import TransactionsPage from './ui/pages/TransactionsPage/TransactionsPage.jsx';

import isNull from '@tinkoff/utils/is/nil';

import { ADMIN_PANEL_URL, RECOVERY_URL } from './constants/constants';

import styles from './App.css';

const mapStateToProps = ({ application }) => {
    return {
        authenticated: application.authenticated
    };
};

const mapDispatchToProps = (dispatch) => ({
    checkAuthentication: payload => dispatch(checkAuthentication(payload)),
    getUnvisitedMoneyOutput: payload => dispatch(getUnvisitedMoneyOutput(payload)),
    getUnvisitedMessageHistory: payload => dispatch(getUnvisitedMessageHistory(payload))
});

class App extends Component {
    static propTypes = {
        checkAuthentication: PropTypes.func.isRequired,
        getUnvisitedMoneyOutput: PropTypes.func.isRequired,
        getUnvisitedMessageHistory: PropTypes.func.isRequired,
        authenticated: PropTypes.bool,
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname } } = this.props;

        this.isRecovery = matchPath(pathname, RECOVERY_URL);
    }

    componentDidMount () {
        this.props.checkAuthentication();
        this.props.getUnvisitedMoneyOutput();
        this.props.getUnvisitedMessageHistory();

        outputWebsocketController.events.on('output', this.props.getUnvisitedMoneyOutput);
    }

    componentWillReceiveProps (nextProps) {
        if (!isNull(nextProps.authenticated) && this.props.authenticated !== nextProps.authenticated) {
            this.setMessageConnection(nextProps.authenticated);
        }
    }

    setMessageConnection = (authenticated) => {
        if (authenticated) {
            messageWebsocketController.connect();
            outputWebsocketController.connect();
        } else {
            messageWebsocketController.disconnect();
            outputWebsocketController.disconnect();
        }
    };

    render () {
        const { authenticated } = this.props;

        if (this.isRecovery) {
            return <Recovery />;
        }

        if (isNull(authenticated)) {
            return <div className={styles.loader}>
                <CircularProgress />
            </div>;
        }

        if (!authenticated) {
            return <Authentication />;
        }

        return <main className={styles.stop}>
            <Header />
            <Switch>
                <Route exact path={ADMIN_PANEL_URL} component={UsersPage} />
                <Route exact path={`${ADMIN_PANEL_URL}/qiwi`} component={QiwiPage} />
                <Route exact path={`${ADMIN_PANEL_URL}/payments`} component={PaymentsPage} />
                <Route exact path={`${ADMIN_PANEL_URL}/messages`} component={ChatPage} />
                <Route exact path={`${ADMIN_PANEL_URL}/credentials`} component={CredentialsPage} />
                <Route exact path={`${ADMIN_PANEL_URL}/db`} component={DatabasePage} />
                <Route exact path={`${ADMIN_PANEL_URL}/outputs`} component={TransactionsPage} />
            </Switch>
        </main>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
