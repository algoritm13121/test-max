import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './TimingScaleButton.css';
import { SCROLL_TOP_LOCKED_EVENT_NAME } from '../../../constants/constants';
import setTimingScale from './../../../actions/setTimingScale';
import outsideClick from '../../hocs/outsideClick.jsx';

const mapStateToProps = ({ application, charts }) => {
    return {
        langMap: application.langMap,
        chartTimeframe: charts.chartTimeframe
    };
};

const mapDispatchToProps = (dispatch) => ({
    setTimingScale: payload => dispatch(setTimingScale(payload))
});

@outsideClick
class TimingScaleButton extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        events: PropTypes.object.isRequired,
        setTimingScale: PropTypes.func.isRequired,
        chartTimeframe: PropTypes.object,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    }

    state = {
        isTimingScaleOpen: false
    }

    componentDidMount () {
        this.props.events.on(SCROLL_TOP_LOCKED_EVENT_NAME, () => this.setState({ isTimingScaleOpen: false }));
    }

    componentDidUpdate () {
        if (this.state.isTimingScaleOpen && !this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => {
                this.setState({
                    isTimingScaleOpen: false
                });
            });
        }
    }

    handlerMenu = () => {
        if (!this.state.isTimingScaleOpen) {
            this.props.events.emit(SCROLL_TOP_LOCKED_EVENT_NAME);
        }

        this.setState({
            isTimingScaleOpen: !this.state.isTimingScaleOpen
        });
    }

    handleTimeClick = (time) => () => {
        this.props.setTimingScale(time);
    }

    render () {
        const { langMap, chartTimeframe } = this.props;
        const { isTimingScaleOpen } = this.state;
        const text = propOr('menu', {}, langMap);

        return <div>
            <div className={classNames(styles.menuContent, {
                [styles.menuOpen]: isTimingScaleOpen
            })}>
                <div className={styles.contentContainer}>
                    {text.timingScaleValue.map(time => <div key={time.id} className={classNames(styles.timeItem, {
                        [styles.activeTimingScale]: time.id === chartTimeframe.id
                    })} onClick={this.handleTimeClick(time)}>
                        {time.label}
                    </div>)}
                </div>
            </div>
            <div className={classNames(styles.buttonContainer, {
                [styles.buttonActive]: isTimingScaleOpen
            })} onClick={this.handlerMenu}>
                <svg className={classNames(styles.buttonImg, {
                    [styles.buttonImgActive]: isTimingScaleOpen
                })} width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* eslint-disable-next-line max-len */}
                    <path d="M0 0H14.4V7.2L9.6 12L14.4 16.8V24H0V16.8L4.8 12L0 7.2V0ZM12 17.4L7.2 12.6L2.4 17.4V21.6H12V17.4ZM7.2 11.4L12 6.6V2.4H2.4V6.6L7.2 11.4ZM4.8 4.8H9.6V5.7L7.2 8.1L4.8 5.7V4.8Z" fill="#A6B1DC" />
                </svg>
                <div className={styles.timingIndex}>{chartTimeframe.label}</div>
                <div className={classNames(styles.button, {
                    [styles.buttonTitleActive]: isTimingScaleOpen
                })}>{text.chartTimeframe}</div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimingScaleButton);
