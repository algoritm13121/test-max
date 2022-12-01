import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './WithdrawSuccessPopup.css';

import propOr from '@tinkoff/utils/object/propOr';

import outsideClick from '../../hocs/outsideClick.jsx';

import setWithdrawSuccessPopup from '../../../actions/setWithdrawSuccessPopup';
import setAccountInfoPopup from '../../../actions/setAccountInfoPopup';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    setWithdrawSuccessPopup: payload => dispatch(setWithdrawSuccessPopup(payload)),
    setAccountInfoPopup: payload => dispatch(setAccountInfoPopup(payload))
});

@outsideClick
class WithdrawSuccessPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        isVisible: PropTypes.bool,
        amount: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        setWithdrawSuccessPopup: PropTypes.func.isRequired,
        setAccountInfoPopup: PropTypes.func.isRequired

    };

    componentDidUpdate (prevProps) {
        const { outsideClickEnabled } = this.props;

        if (this.props.isVisible !== prevProps.isVisible && this.props.isVisible && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleSetWithdrawSuccessPopup);
        }
    }

    handleOutsideClick = () => {
        this.props.turnOnClickOutside(this, this.handleSetWithdrawSuccessPopup);
    }

    handleSetWithdrawSuccessPopup = () => {
        this.props.setWithdrawSuccessPopup(false);
        this.props.setAccountInfoPopup(false);
    }

    render () {
        const { langMap, isVisible, amount } = this.props;
        const text = propOr('withdrawSuccess', {}, langMap);

        return <div onClick={this.handleOutsideClick}
            className={classNames(styles.root, {
                [styles.isVisible]: isVisible
            })}>
            <div className={styles.cover} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <div className={styles.content}>
                            <div className={styles.topTitle}>
                                {text.topTitle}{amount}<br />
                                <span>{text.success}</span> {text.sended}
                            </div>
                            <div className={styles.bottomTitle}>
                                {text.bottomTitle}
                            </div>
                            <img src="/src/apps/client/ui/components/WithdrawSuccessPopup/images/tick.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawSuccessPopup);
