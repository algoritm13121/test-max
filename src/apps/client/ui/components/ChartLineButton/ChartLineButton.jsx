import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './ChartLineButton.css';
import { SCROLL_TOP_LOCKED_EVENT_NAME, CHART_TYPES } from '../../../constants/constants';
import setChartLine from '../../../actions/setChartLine';
import outsideClick from '../../hocs/outsideClick.jsx';

const mapStateToProps = ({ application, charts }) => {
    return {
        langMap: application.langMap,
        chartType: charts.chartType
    };
};

const mapDispatchToProps = (dispatch) => ({
    setChartLine: payload => dispatch(setChartLine(payload))
});

@outsideClick
class ChartLineButton extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        events: PropTypes.object.isRequired,
        setChartLine: PropTypes.func.isRequired,
        chartType: PropTypes.object,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    }

    state = {
        isChartLineOpen: false
    }

    componentDidMount () {
        this.props.events.on(SCROLL_TOP_LOCKED_EVENT_NAME, () => this.setState({ isChartLineOpen: false }));
    }

    componentDidUpdate () {
        if (this.state.isChartLineOpen && !this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => {
                this.setState({
                    isChartLineOpen: false
                });
            });
        }
    }

    handlerMenu = () => {
        if (!this.state.isChartLineOpen) {
            this.props.events.emit(SCROLL_TOP_LOCKED_EVENT_NAME);
        }

        this.setState({
            isChartLineOpen: !this.state.isChartLineOpen
        });
    }

    handleLineClick = (line) => () => {
        this.props.setChartLine(line);
    }

    render () {
        const { langMap, chartType } = this.props;
        const { isChartLineOpen } = this.state;
        const text = propOr('menu', {}, langMap);

        return <div>
            <div className={classNames(styles.menuContent, {
                [styles.menuOpen]: isChartLineOpen
            })}>
                <div className={styles.contentContainer}>
                    <div className={classNames(styles.lineItem, styles.candlesticks, {
                        [styles.activeChartLine]: CHART_TYPES[0].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[0])}>
                        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M13.7261 4.18553H11.9883V0.714233H10.2505V4.18553H8.5127V14.5994H10.2505V18.0707H11.9883V14.5994H13.7261V4.18553Z" fill="#A6B1DC" />
                            {/* eslint-disable-next-line max-len */}
                            <path d="M5.7847 7.13622H4.0469V3.66492H2.30909V7.13622H0.571289V15.8145H2.30909V19.2858H4.0469V15.8145H5.7847V7.13622ZM4.0469 14.0788H2.30909V8.87187H4.0469V14.0788Z" fill="#A6B1DC" />
                        </svg>
                    </div>
                    <div className={classNames(styles.lineItem, styles.heikinashi, {
                        [styles.activeChartLine]: CHART_TYPES[1].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[1])}>
                        <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M12.4402 6.14277H10.7024V0.714233H8.96461V6.14277H7.22681V13.2142H8.96461V18.0707H10.7024V13.2142H12.4402V6.14277Z" fill="#A6B1DC" />
                            {/* eslint-disable-next-line max-len */}
                            <path d="M5.7847 8.99983H4.0469V3.57129H2.30909V8.99983H0.571289V16.0713H2.30909V20.9278H4.0469V16.0713H5.7847V8.99983Z" fill="#A6B1DC" />
                        </svg>
                    </div>
                    <div className={classNames(styles.lineItem, styles.hlc, {
                        [styles.activeChartLine]: CHART_TYPES[2].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[2])}>
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.61232 1.28577H5.95926V5.32657H5.95929V6.67351H5.95926V13.4082H7.3062V14.7551H5.95926V17.449H4.61232V14.7551V13.4082V6.67351H0.571533V5.32657H4.61232V1.28577Z" fill="#A6B1DC" />
                            {/* eslint-disable-next-line max-len */}
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.0408 0H12.3877V4.0408H12.3878V5.38774H12.3877V12.1224H13.7347V13.4693H12.3877V16.1633H11.0408V13.4693V12.1224V5.38774H7V4.0408H11.0408V0Z" fill="#A6B1DC" />
                        </svg>
                    </div>
                    <div className={classNames(styles.lineItem, styles.line, {
                        [styles.activeChartStroke]: CHART_TYPES[3].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[3])}>
                        <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M1.42847 17.7143L6.3992 6.53013C6.46785 6.37567 6.68526 6.37073 6.76085 6.52191L10.2401 13.4804C10.3155 13.6311 10.5322 13.6267 10.6013 13.473L16.0341 1.40018C16.1045 1.24376 16.3262 1.24271 16.3981 1.39844L23.9285 17.7143" stroke="#A6B1DC" />
                        </svg>
                    </div>
                    <div className={classNames(styles.lineItem, styles.area, {
                        [styles.activeChartLine]: CHART_TYPES[4].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[4])}>
                        <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M5.3992 5.53013L0.553457 16.4331C0.494676 16.5653 0.591487 16.7143 0.736219 16.7143H22.6159C22.7618 16.7143 22.8586 16.563 22.7975 16.4305L15.3981 0.398441C15.3262 0.242706 15.1045 0.243765 15.0341 0.400179L9.60134 12.473C9.53216 12.6267 9.31547 12.6311 9.24007 12.4804L5.76085 5.52191C5.68526 5.37073 5.46785 5.37567 5.3992 5.53013Z" fill="#A6B1DC" />
                        </svg>
                    </div>
                    <div className={classNames(styles.lineItem, styles.dots, {
                        [styles.activeChartStroke]: CHART_TYPES[5].id === chartType.id
                    })} onClick={this.handleLineClick(CHART_TYPES[5])}>
                        <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M1.42847 17.7143L6.48526 6.33649C6.51959 6.25927 6.62829 6.2568 6.66609 6.33239L10.3343 13.6687C10.372 13.7441 10.4803 13.7419 10.5149 13.6651L16.1241 1.20009C16.1593 1.12188 16.2702 1.12135 16.3061 1.19922L23.9285 17.7143" stroke="#A6B1DC" strokeDasharray="3 1" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className={classNames(styles.buttonContainer, {
                [styles.buttonActive]: isChartLineOpen
            })} onClick={this.handlerMenu}>
                <div className={styles.iconContainer}>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.buttonImgActive]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[0].id
                    })} width="19" height="26" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M13.7261 4.18553H11.9883V0.714233H10.2505V4.18553H8.5127V14.5994H10.2505V18.0707H11.9883V14.5994H13.7261V4.18553Z" fill="#A6B1DC" />
                        {/* eslint-disable-next-line max-len */}
                        <path d="M5.7847 7.13622H4.0469V3.66492H2.30909V7.13622H0.571289V15.8145H2.30909V19.2858H4.0469V15.8145H5.7847V7.13622ZM4.0469 14.0788H2.30909V8.87187H4.0469V14.0788Z" fill="#A6B1DC" />
                    </svg>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.buttonImgActive]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[1].id
                    })} width="19" height="26" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M12.4402 6.14277H10.7024V0.714233H8.96461V6.14277H7.22681V13.2142H8.96461V18.0707H10.7024V13.2142H12.4402V6.14277Z" fill="#A6B1DC" />
                        {/* eslint-disable-next-line max-len */}
                        <path d="M5.7847 8.99983H4.0469V3.57129H2.30909V8.99983H0.571289V16.0713H2.30909V20.9278H4.0469V16.0713H5.7847V8.99983Z" fill="#A6B1DC" />
                    </svg>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.buttonImgActive]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[2].id
                    })} width="19" height="26" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.61232 1.28577H5.95926V5.32657H5.95929V6.67351H5.95926V13.4082H7.3062V14.7551H5.95926V17.449H4.61232V14.7551V13.4082V6.67351H0.571533V5.32657H4.61232V1.28577Z" fill="#A6B1DC" />
                        {/* eslint-disable-next-line max-len */}
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.0408 0H12.3877V4.0408H12.3878V5.38774H12.3877V12.1224H13.7347V13.4693H12.3877V16.1633H11.0408V13.4693V12.1224V5.38774H7V4.0408H11.0408V0Z" fill="#A6B1DC" />
                    </svg>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.activeChartStroke]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[3].id
                    })} width="19" height="26" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M1.42847 17.7143L6.3992 6.53013C6.46785 6.37567 6.68526 6.37073 6.76085 6.52191L10.2401 13.4804C10.3155 13.6311 10.5322 13.6267 10.6013 13.473L16.0341 1.40018C16.1045 1.24376 16.3262 1.24271 16.3981 1.39844L23.9285 17.7143" stroke="#A6B1DC" />
                    </svg>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.buttonImgActive]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[4].id
                    })} width="19" height="26" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M5.3992 5.53013L0.553457 16.4331C0.494676 16.5653 0.591487 16.7143 0.736219 16.7143H22.6159C22.7618 16.7143 22.8586 16.563 22.7975 16.4305L15.3981 0.398441C15.3262 0.242706 15.1045 0.243765 15.0341 0.400179L9.60134 12.473C9.53216 12.6267 9.31547 12.6311 9.24007 12.4804L5.76085 5.52191C5.68526 5.37073 5.46785 5.37567 5.3992 5.53013Z" fill="#A6B1DC" />
                    </svg>
                    <svg className={classNames(styles.buttonImg, {
                        [styles.activeChartStroke]: isChartLineOpen,
                        [styles.buttonChooseIconActive]: chartType.id === CHART_TYPES[5].id
                    })} width="19" height="26" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M1.42847 17.7143L6.48526 6.33649C6.51959 6.25927 6.62829 6.2568 6.66609 6.33239L10.3343 13.6687C10.372 13.7441 10.4803 13.7419 10.5149 13.6651L16.1241 1.20009C16.1593 1.12188 16.2702 1.12135 16.3061 1.19922L23.9285 17.7143" stroke="#A6B1DC" strokeDasharray="3 1" />
                    </svg>
                </div>
                <div className={classNames(styles.button, {
                    [styles.buttonTitleActive]: isChartLineOpen
                })}>{text.chart}</div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartLineButton);
