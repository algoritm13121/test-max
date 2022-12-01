import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';

import styles from './AuthorizationPanel.css';

import setAuthenticationPopup from './../../../actions/setAuthenticationPopup';

import noop from '@tinkoff/utils/function/noop';
import isEmpty from '@tinkoff/utils/is/empty';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    setAuthenticationPopup: payload => dispatch(setAuthenticationPopup(payload))
});

class AuthorizationPanel extends Component {
    static propTypes = {
        user: PropTypes.object,
        langMap: PropTypes.object.isRequired,
        setAuthenticationPopup: PropTypes.func
    }

    static defaultProps = {
        setAuthenticationPopup: noop,
        user: {}
    };

    handleAuthenticationForm = index => () => {
        this.props.setAuthenticationPopup({ isPopup: true, index });
    }

    render () {
        const { langMap, user } = this.props;
        const text = propOr('authorizationPanel', {}, langMap);

        return [
            !isEmpty(user)
                ? <div key={0} className={styles.authorizationContainer}>
                    <div className={styles.avatarContainer}>
                        <img className={styles.avatar} src="/src/apps/client/ui/components/Header/images/avatar.svg" alt="avatar" />
                        { user.accountStatus && <img
                            className={styles.wreath}
                            src={`/src/apps/client/ui/components/AuthorizationPanel/images/${user && user.accountStatus}.svg`}
                            alt="wreath"
                        />}
                    </div>
                    <div className={styles.mainInfo}>
                        <div className={styles.name}>{user.name} {user.surname}</div>
                        <div className={styles.statusContainer}>
                            { user.accountStatus && <div className={classNames(styles.status, {
                                [styles.goldStatus]: user.accountStatus === 'gold',
                                [styles.platinumStatus]: user.accountStatus === 'platinum',
                                [styles.diamondStatus]: user.accountStatus === 'diamond',
                                [styles.vipStatus]: user.accountStatus === 'vip'
                            })}>{user.accountStatus}</div>}
                            <div className={styles.hash}>#{user.accountNumber}</div>
                        </div>
                    </div>
                </div>
                : <div key={1} className={styles.authorizationContainer}>
                    <img className={styles.defaultAvatar} src="/src/apps/client/ui/components/Header/images/avatar.svg" alt="avatar" />
                    <div className={styles.signIn} onClick={this.handleAuthenticationForm(1)}>{text.signIn}</div>
                    <div className={styles.signUp} onClick={this.handleAuthenticationForm(2)}>{text.signUp}</div>
                </div>
        ];
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationPanel);
