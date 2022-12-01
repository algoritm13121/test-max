import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Footer.css';
import AssetsButton from '../AssetsButton/AssetsButton';
import OpenedOrders from '../OpenedOrders/OpenedOrders';
import ClosedOrders from '../ClosedOrders/ClosedOrders';

import { SCROLL_TOP_LOCKED_EVENT_NAME } from '../../../constants/constants';

import formatNumberToString from '../../../utils/formatNumberToString';

import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';

import outsideClick from '../../hocs/outsideClick.jsx';

const MIN_DESKTOP = 1024;

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        mediaWidth: application.media.width,
        closedOrders: data.closedOrders,
        currentAsset: data.currentAsset,
        countClosedOrders: data.countClosedOrders
    };
};

@outsideClick
class Footer extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        mediaWidth: PropTypes.number.isRequired,
        events: PropTypes.object.isRequired,
        closedOrders: PropTypes.array.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        countClosedOrders: PropTypes.number
    };

    positionSliderRef = React.createRef();
    openOrdersSliderRef = React.createRef();
    // closeOrdersSliderRef = React.createRef();
    mobileMiddleContainerRef = React.createRef();

    state = {
        mainBalance: 0,
        balance: 0,
        totalPledge: 0,
        freeBalance: 0,
        totalProfit: 0,
        marginLevel: 0,
        bonuses: 0,
        credFacilities: 0,
        isFooterContentVisible: false,
        activeSlidePosition: 1,
        isFullScreen: false,
        openOrders: 0,
        hasMore: true
    };

    componentDidMount () {
        this.props.events.on(SCROLL_TOP_LOCKED_EVENT_NAME, () => this.setState({ isFooterContentVisible: false }));

        assetPriceWebsocketController.events.on('ordersAndBalance', this.handleOrdersAndBalanceChange);

        // this.props.events.on('onCloseOrder', () => {
        //     this.setState({
        //         mainBalance: this.state.balance
        //     });
        // });
    }

    componentDidUpdate () {
        if (this.props.mediaWidth > MIN_DESKTOP && this.state.isFooterContentVisible && !this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => {
                this.setState({
                    isFooterContentVisible: false
                });
            });
        }
    }

    handleOrdersAndBalanceChange = ({ balance, orders, totalPledge, freeBalance, totalProfit, marginLevel, bonuses, credFacilities, mainBalance }) => {
        this.setState({
            mainBalance,
            balance,
            openOrdersLength: orders.length,
            totalPledge,
            freeBalance,
            totalProfit,
            marginLevel,
            bonuses,
            credFacilities
        });
    };

    handlePositionClick = index => () => {
        if (!index && !this.state.isFooterContentVisible) {
            this.props.events.emit(SCROLL_TOP_LOCKED_EVENT_NAME);
            this.setState({
                isFooterContentVisible: !this.state.isFooterContentVisible
            });
        } else if (!this.state.isFooterContentVisible && this.state.activeSlidePosition !== index) {
            this.setState({ isFooterContentVisible: !this.state.isFooterContentVisible });
        }

        if (this.state.activeSlidePosition === index) {
            this.setState({ isFooterContentVisible: !this.state.isFooterContentVisible });
        }

        let currentLeft = -(index - 1) * this.props.mediaWidth;

        if (index === 2 && MIN_DESKTOP < this.props.mediaWidth) {
            this.positionSliderRef.current.style.left = currentLeft + 84 + 'px';
        } else {
            this.positionSliderRef.current.style.left = currentLeft + 'px';
        }

        this.setState({
            activeSlidePosition: index
        });
    };

    handleResize = button => () => {
        if (button === 'show') {
            this.setState({
                isFullScreen: !this.state.isFullScreen,
                isFooterContentVisible: true
            });
            return;
        }
        this.setState({
            isFullScreen: false,
            isFooterContentVisible: false
        });
    };

    loadMore () {
        this.props.events.emit('SCROLL_DOWN_ORDERS_CLOSE');
    }

    render () {
        const { langMap, events, closedOrders, countClosedOrders } = this.props;
        const {
            isFooterContentVisible,
            activeSlidePosition,
            isFullScreen,
            balance,
            openOrdersLength,
            totalPledge,
            freeBalance,
            totalProfit,
            marginLevel,
            mainBalance,
            bonuses,
            credFacilities
        } = this.state;
        const text = propOr('footer', {}, langMap);

        return <section>
            <div className={classNames(styles.root, {
                [styles.footerContentVisible]: isFooterContentVisible,
                [styles.footerRootContainerFullSize]: isFooterContentVisible && isFullScreen

            })}>
                <div className={styles.rootContainer}>
                    <div className={classNames(styles.leftContainer, {
                        [styles.showMobileLeftContainer]: isFooterContentVisible
                    })}>
                        <div onClick={this.handlePositionClick(1)} className={classNames(styles.leftContainerItem, {
                            [styles.activePositionButton]: activeSlidePosition === 1 && isFooterContentVisible
                        })}>{text.openPosition}<span className={styles.itemValue}>{openOrdersLength}</span></div>
                        <div onClick={this.handlePositionClick(2)} className={classNames(styles.leftContainerItem, {
                            [styles.activePositionButton]: activeSlidePosition === 2 && isFooterContentVisible
                        })}>{text.closePosition}<span className={styles.itemValue}>{countClosedOrders}</span></div>
                        <div className={styles.leftContainerItem}>{text.pu}<span className={classNames(styles.itemValue, {
                            [styles.posValue]: totalProfit > 0,
                            [styles.negValue]: totalProfit < 0
                        })}>
                            $ {formatNumberToString(totalProfit)}
                        </span></div>
                    </div>
                    <div className={classNames(styles.middleContainer, styles.middleContainerDesktop)}>
                        <div className={classNames(styles.middleContainerButton, styles.pu)}>{text.pu}
                            <span className={classNames(styles.buttonItem, {
                                [styles.posValue]: totalProfit > 0,
                                [styles.negValue]: totalProfit < 0
                            })}>$ {formatNumberToString(totalProfit)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                            {text.balance}
                            <br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(mainBalance)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                            {text.facilities}
                            <br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(balance)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                            {text.bonuses}
                            <br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(bonuses)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                            {text.credFacilities}
                            <br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(credFacilities)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.free)}>{text.free}<br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(freeBalance)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.pledge)}>{text.pledge}<br />
                            <span className={styles.buttonItem}>$ {formatNumberToString(totalPledge)}</span>
                        </div>
                        <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                            {text.marginLevel}
                            <br />
                            <span className={styles.buttonItem}>% {formatNumberToString(marginLevel)}</span>
                        </div>
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.buttonContainer} onClick={this.handleResize()}>
                            <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* eslint-disable-next-line max-len */}
                                <path d="M16.7889 4.76667L20 1.57778L18.4222 0L15.2333 3.21111L12.6778 0.655556V7.32222H19.3444L16.7889 4.76667ZM0.655556 7.32222H7.32222V0.655556L4.76667 3.21111L1.57778 0L0 1.57778L3.21111 4.76667L0.655556 7.32222ZM1.57778 20L4.76667 16.7889L7.32222 19.3444V12.6778H0.655556L3.21111 15.2333L0 18.4222L1.57778 20ZM18.4222 20L20 18.4222L16.7889 15.2333L19.3444 12.6778H12.6778V19.3444L15.2333 16.7889L18.4222 20Z" fill="#A6B1DC" />
                            </svg>
                        </div>
                        <div className={classNames(styles.buttonContainer, {
                            [styles.activeButton]: isFooterContentVisible
                        })} onClick={this.handleResize('show')}>
                            <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* eslint-disable-next-line max-len */}
                                <path d="M15.8889 2.55556L12.6778 5.74444L14.2556 7.32222L17.4444 4.11111L20 6.66667V0H13.3333L15.8889 2.55556ZM6.66667 0H0V6.66667L2.55556 4.11111L5.74444 7.32222L7.32222 5.74444L4.11111 2.55556L6.66667 0ZM5.74444 12.6778L2.55556 15.8889L0 13.3333V20H6.66667L4.11111 17.4444L7.32222 14.2556L5.74444 12.6778ZM14.2556 12.6778L12.6778 14.2556L15.8889 17.4444L13.3333 20H20V13.3333L17.4444 15.8889L14.2556 12.6778Z" fill="#A6B1DC" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.rootLeftColumn, {
                    [styles.rootLeftColumnShow]: isFooterContentVisible,
                    [styles.rootLeftFullSize]: isFooterContentVisible && isFullScreen
                })} />
                <div className={classNames(styles.footerOrderContainer)}>
                    <div ref={this.positionSliderRef} className={styles.footerOpenContainer}>
                        <div ref={this.openOrdersSliderRef} className={classNames(styles.openPositionSlide, {
                            [styles.positionsFullSize]: isFooterContentVisible && isFullScreen
                        })}>
                            <OpenedOrders events={events}/>
                        </div>
                        <div className={classNames(styles.closePositionSlide, {
                            [styles.positionsFullSize]: isFooterContentVisible && isFullScreen
                        })} ref={(ref) => this.closeOrdersSliderRef = ref}>
                            <InfiniteScroll
                                pageStart={1}
                                loadMore={this.loadMore.bind(this)}
                                hasMore={closedOrders.length < countClosedOrders}
                                initialLoad={false}
                                loader={<div className={styles.loaderClosedOrders} key={0}>Loading ...</div>}
                                useWindow={false}
                                getScrollParent={() => this.closeOrdersSliderRef}
                            >
                                <ClosedOrders events={events}/>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.mobileAssetsButton}>
                <AssetsButton events={events} />
                <div className={styles.mobileAssetsMiddleLine} />
                <div className={styles.mobileOperations}>
                    <div className={classNames(styles.mobileOperationsButton, {
                        [styles.mobileOperationsActive]: isFooterContentVisible
                    })}
                    onClick={this.handlePositionClick(1)}
                    >
                        <svg width="16" height="28" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* eslint-disable-next-line max-len */}
                            <path d="M13.0798 2.58337H10.1111C10.1111 1.34236 9.04605 0.333374 7.73608 0.333374C6.42612 0.333374 5.36108 1.34236 5.36108 2.58337H2.39233C1.40894 2.58337 0.611084 3.33923 0.611084 4.27087V16.6459C0.611084 17.5775 1.40894 18.3334 2.39233 18.3334H13.0798C14.0632 18.3334 14.8611 17.5775 14.8611 16.6459V4.27087C14.8611 3.33923 14.0632 2.58337 13.0798 2.58337ZM7.73608 1.73962C8.22964 1.73962 8.62671 2.1158 8.62671 2.58337C8.62671 3.05095 8.22964 3.42712 7.73608 3.42712C7.24253 3.42712 6.84546 3.05095 6.84546 2.58337C6.84546 2.1158 7.24253 1.73962 7.73608 1.73962ZM12.2337 9.88884L6.9271 14.874C6.75269 15.0392 6.47065 15.0357 6.29624 14.8705L3.23101 11.942C3.05659 11.7767 3.0603 11.5095 3.23472 11.3443L4.28862 10.3529C4.46304 10.1877 4.74507 10.1912 4.91948 10.3564L6.62651 11.9877L10.5601 8.28923C10.7345 8.124 11.0166 8.12751 11.191 8.29275L12.2375 9.29119C12.4119 9.45994 12.4082 9.72361 12.2337 9.88884Z" fill="#A6B1DC" />
                        </svg>
                        <div className={styles.mobileOperationsTitle}>Операции</div>
                    </div>
                </div>
            </div>
            <div ref={this.mobileMiddleContainerRef} className={classNames(styles.middleContainer, styles.middleContainerMobile, {
            })}>
                <div className={classNames(styles.middleContainerButton, styles.pu)}>{text.pu}
                    <span className={classNames(styles.buttonItem, {
                        [styles.posValue]: totalProfit > 0,
                        [styles.negValue]: totalProfit < 0
                    })}>$ {formatNumberToString(totalProfit)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                    {text.balance}
                    <span className={styles.buttonItem}>$ {formatNumberToString(mainBalance)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                    {text.facilities}
                    <span className={styles.buttonItem}>$ {formatNumberToString(balance)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                    {text.bonuses}
                    <span className={styles.buttonItem}>$ {formatNumberToString(bonuses)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                    {text.credFacilities}
                    <span className={styles.buttonItem}>$ {formatNumberToString(credFacilities)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.free)}>{text.free}
                    <span className={styles.buttonItem}>$ {formatNumberToString(freeBalance)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.pledge)}>{text.pledge}
                    <span className={styles.buttonItem}>$ {formatNumberToString(totalPledge)}</span>
                </div>
                <div className={classNames(styles.middleContainerButton, styles.facilities)}>
                    {text.marginLevel}
                    <span className={styles.buttonItem}>% {formatNumberToString(marginLevel)}</span>
                </div>
            </div>
        </section>;
    }
}

export default connect(mapStateToProps)(Footer);
