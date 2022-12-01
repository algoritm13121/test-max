import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getHistoryPrice from '../../../services/client/getHistoryPrice';
import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';

import getPeriodByTimeframe from './utils/getPeriodByTimeframe';
import getChartDateByTimeframe from './utils/getChartDateByTimeframe';
import formatPriceToString from '../../../utils/formatPriceToString';

import last from '@tinkoff/utils/array/last';
import min from 'lodash.min';
import max from 'lodash.max';
import isUndefined from '@tinkoff/utils/is/undefined';
import isEmpty from '@tinkoff/utils/is/empty';

import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';

import styles from './MainPage.css';

import calculateBuyingPrice from '../../../utils/calculateBuyPrice';

const PRICE_UP_COLOR = '#0ea97b';
const PRICE_DOWN_COLOR = 'rgba(235, 87, 87, 0.75)';

if (typeof window !== 'undefined') {
    var { createChart } = require('lightweight-charts/dist/lightweight-charts.esm.production.js');
}

const chartOptions = {
    layout: {
        backgroundColor: 'rgb(20,26,43)',
        border: 'solid',
        textColor: '#d1d4dc'
    },
    grid: {
        vertLines: {
            color: 'rgba(42, 46, 57, 0.5)'
        },
        horzLines: {
            color: 'rgba(42, 46, 57, 0.5)'
        }
    },
    rightPriceScale: {
        borderVisible: true
    },
    crosshair: {
        horzLine: {
            visible: true
        }
    },
    timeScale: {
        borderVisible: true,
        timeVisible: true
    },
    watermark: {
        color: 'rgba(231,232,238,0.05)',
        visible: true,
        fontFamily: 'FuturaPT-Medium',
        fontSize: 128,
        letterSpacing: '0.012em'
    }
};

const mapStateToProps = ({ application, charts }) => {
    return {
        chartTimeframe: charts.chartTimeframe,
        chartType: charts.chartType,
        chartSymbolGroup: charts.chartSymbolGroup,
        chartSymbol: charts.chartSymbol,
        mediaWidth: application.media.width,
        mediaHeight: application.media.height
    };
};

const mapDispatchToProps = (dispatch) => ({
    getHistoryPrice: payload => dispatch(getHistoryPrice(payload))
});

class MainPage extends Component {
    static propTypes = {
        getHistoryPrice: PropTypes.func.isRequired,
        chartTimeframe: PropTypes.object.isRequired,
        chartType: PropTypes.object.isRequired,
        chartSymbolGroup: PropTypes.object.isRequired,
        chartSymbol: PropTypes.object.isRequired
    };

    state = {
        width: 0,
        height: 0,
        asset: {}
    };

    prevFloatingPrice = null;
    times = [];
    prices = [];
    openPrices = [];
    lowPrices = [];
    highPrices = [];
    chartsContainer = React.createRef();

    status = true;
    isLoading = false;

    componentDidMount () {
        // console.log('componentDidMount');
        this.setChart();
        this.setNewTypeOrTimeChart(this.props.chartSymbolGroup.id, this.props.chartSymbol.name, this.props.chartTimeframe.value, this.props.chartType.value);

        assetPriceWebsocketController.events.on('status', (status) => {
            if (status && !this.status) {
                this.setNewTypeOrTimeChart(
                    this.props.chartSymbolGroup.id,
                    this.props.chartSymbol.name,
                    this.props.chartTimeframe.value,
                    this.props.chartType.value
                );
            }

            this.status = status;
        });
    }

    componentWillReceiveProps (nextProps, nextContext) {
        // console.log('componentWillReceiveProps');
        if (this.props.chartSymbol !== nextProps.chartSymbol ||
            this.props.chartTimeframe !== nextProps.chartTimeframe ||
            this.props.chartType !== nextProps.chartType
        ) {
            this.setNewTypeOrTimeChart(nextProps.chartSymbolGroup.id, nextProps.chartSymbol.name, nextProps.chartTimeframe.value, nextProps.chartType.value);
        }
    }

    getSeriesByType = type => {
        switch (type) {
        case 'candlesticks':
            return this.chart.addCandlestickSeries({
                upColor: PRICE_UP_COLOR,
                downColor: PRICE_DOWN_COLOR,
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        case 'heikinashi':
            return this.chart.addCandlestickSeries({
                upColor: PRICE_UP_COLOR,
                downColor: PRICE_DOWN_COLOR,
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        case 'hlc':
            return this.chart.addBarSeries({
                thinBars: false,
                upColor: PRICE_UP_COLOR,
                downColor: PRICE_DOWN_COLOR,
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        case 'line':
            return this.chart.addLineSeries({
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        case 'area':
            return this.chart.addAreaSeries({
                lineColor: '#1567a4',
                topColor: 'rgba(30,118,187,0.6)',
                bottomColor: 'rgba(34, 150, 243, 0)',
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        case 'dots':
            return this.chart.addLineSeries({
                color: 'transparent',
                crosshairMarkerVisible: false,
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001
                }
            });
        }
    };

    getCandlesData = (type, { low, high, open, close, newCandle = true }) => {
        if (type !== 'heikinashi' || !this.haOpen || !this.haClose) {
            return { low, high, open, close };
        }

        const haClose = (low + high + open + close) / 4;
        const haOpen = (this.haOpen + this.haClose) / 2;
        const haHigh = max([high, haOpen, haClose]);
        const haLow = min([low, haOpen, haClose]);

        if (newCandle) {
            this.haOpen = haOpen;
            this.haClose = haClose;
        }

        return {
            low: haLow,
            high: haHigh,
            open: haOpen,
            close: haClose
        };
    };

    findRightDimensions = () => {
        let width = window.innerWidth - 84;
        let height = window.innerHeight - 150;

        if (window.innerWidth <= 1024 && window.innerWidth <= window.innerHeight) {
            width = window.innerWidth;
            height = window.innerHeight - 187;
        }
        if (window.innerWidth <= 1024 && window.innerWidth > window.innerHeight) {
            width = window.innerWidth;
            height = window.innerHeight - 135;
        }
        if (window.innerWidth <= 544) {
            width = window.innerWidth;
            height = window.innerHeight - 135;
        }
        return { width, height };
    }

    setChart = () => {
        this.chart = createChart(this.chartsContainer.current, {
            ...chartOptions,
            width: this.findRightDimensions().width,
            height: this.findRightDimensions().height
        });

        assetPriceWebsocketController.events.on('data', this.handlePriceChange);

        window.addEventListener('resize', () => {
            this.chart.resize(this.findRightDimensions().width, this.findRightDimensions().height);
        });

        this.chart.timeScale().subscribeVisibleLogicalRangeChange(this.onVisibleLogicalRangeChanged);
    };

    handleUnsubscribeVisibleLogicalRangeChange = () => {
        this.chart.timeScale().unsubscribeVisibleLogicalRangeChange(this.onVisibleLogicalRangeChanged);
    }

    onVisibleLogicalRangeChanged = newVisibleLogicalRange => {
        // console.log('onVisibleLogicalRangeChanged');
        const { chartSymbolGroup, chartSymbol, chartTimeframe, chartType } = this.props;

        if (!newVisibleLogicalRange) {
            return;
        }

        const barsInfo = this.series.barsInLogicalRange(newVisibleLogicalRange);

        if (barsInfo !== null && barsInfo.barsBefore < 0 && !this.isLoading) {
            this.setNewDataChart(chartSymbolGroup.id, chartSymbol.name, chartTimeframe.value, chartType.value, barsInfo.from, barsInfo.to);
        }
    }

    setNewDataChart = (symbolGroup, symbol, timeframe, type, from, to) => {
        // console.log('setNewDataChart');
        this.isLoading = true;
        this.handleUnsubscribeVisibleLogicalRangeChange();

        this.props.getHistoryPrice({
            ...getPeriodByTimeframe(timeframe, symbolGroup, from),
            resolution: timeframe,
            symbolGroup: symbolGroup,
            symbol
        })
            .then(historyData => {
                if (this.series) {
                    this.chart.removeSeries(this.series);
                    this.series = null;
                }

                const series = this.getSeriesByType(type);

                this.series = series;

                if (historyData.s === 'ok') {
                    this.times = [...historyData.t.slice(0, -2), ...this.times];
                    this.prices = [...historyData.c.slice(0, -2), ...this.prices];
                    this.openPrices = [...historyData.o.slice(0, -2), ...this.openPrices];
                    this.lowPrices = [...historyData.l.slice(0, -2), ...this.lowPrices];
                    this.highPrices = [...historyData.h.slice(0, -2), ...this.highPrices];

                    series.setData(this.times.map((time, i) => {
                        if (i === 0) {
                            return null;
                        }

                        return {
                            time,
                            value: this.prices[i],
                            ...this.getCandlesData(type, {
                                open: this.openPrices[i],
                                low: this.lowPrices[i],
                                high: this.highPrices[i],
                                close: this.prices[i]
                            })
                        };
                    }).filter(data => !!data));

                    this.chart.timeScale().setVisibleRange({ from, to });
                    this.chart.timeScale().subscribeVisibleLogicalRangeChange(this.onVisibleLogicalRangeChanged);
                    this.isLoading = false;
                }
            });
    };

    setNewTypeOrTimeChart = (symbolGroup, symbol, timeframe, type) => {
        if (this.series) {
            this.chart.removeSeries(this.series);
            this.series = null;

            this.chart.applyOptions({
                watermark: {
                    text: ''
                }
            });

            this.setState({ asset: {} });
            this.chart.priceScale().applyOptions({ autoScale: true });
        }
        this.props.getHistoryPrice({
            ...getPeriodByTimeframe(timeframe, symbolGroup),
            resolution: timeframe,
            symbolGroup: symbolGroup,
            symbol
        })
            .then(historyData => {
                const series = this.getSeriesByType(type);

                this.series = series;

                if (historyData.s === 'ok') {
                    if (!isUndefined(assetPriceWebsocketController.prices[symbol])) {
                        historyData.c[historyData.c.length - 1] = assetPriceWebsocketController.prices[symbol];
                    }

                    this.times = historyData.t;
                    this.prices = historyData.c;
                    this.openPrices = historyData.o;
                    this.lowPrices = historyData.l;
                    this.highPrices = historyData.h;
                    this.prevFloatingPrice = last(this.prices);

                    this.haOpen = historyData.o[0];
                    this.haClose = historyData.c[0];

                    const data = historyData.t.map((time, i) => {
                        if (i === 0) {
                            return null;
                        }

                        return {
                            time,
                            value: historyData.c[i],
                            ...this.getCandlesData(type, {
                                open: historyData.o[i],
                                low: historyData.l[i],
                                high: historyData.h[i],
                                close: historyData.c[i]
                            })
                        };
                    }).filter(data => !!data);

                    series.setData(data);

                    if (type === 'dots') {
                        this.markers = historyData.t.map((time, i) => {
                            if (i === 0) {
                                return null;
                            }

                            return {
                                time,
                                position: 'inBar',
                                size: 1,
                                shape: 'circle',
                                value: historyData.c[i],
                                color: historyData.c[i] > historyData.c[i - 1] ? PRICE_UP_COLOR : PRICE_DOWN_COLOR
                            };
                        }).filter(data => !!data);
                        series.setMarkers(this.markers);

                        const lastIndex = historyData.c.length - 1;

                        series.applyOptions({
                            priceLineColor: historyData.c[lastIndex] > historyData.c[lastIndex - 1] ? PRICE_UP_COLOR : PRICE_DOWN_COLOR
                        });
                    }

                    this.chart.applyOptions({
                        watermark: {
                            text: `${CHART_SYMBOL_INFO_MAP[symbol].title}`
                        }
                    });

                    this.handleAssetSet(this.props.chartSymbol);
                }
            });
    };

    handleAssetSet = chartSymbol => {
        const price = assetPriceWebsocketController.prices[chartSymbol.name];
        this.setState({
            asset: {
                assetName: chartSymbol.name,
                purchasePrice: calculateBuyingPrice(chartSymbol.name, price),
                sellingPrice: price
            }
        });
    }

    handlePriceChange = data => {
        if (!this.series) {
            return;
        }
        const { chartTimeframe, chartType, chartSymbol } = this.props;

        if (data.name !== chartSymbol.name) {
            return;
        }

        this.handleAssetSet(data);

        const chartDate = getChartDateByTimeframe(data.time, chartTimeframe.value);
        let newCandle = false;

        if (last(this.times) !== chartDate) {
            this.prices[this.prices.length - 1] = this.prevFloatingPrice;
            this.times.push(chartDate);
            this.openPrices.push(data.price);
            this.prices.push(data.price);
            this.lowPrices.push(data.price);
            this.highPrices.push(data.price);

            newCandle = true;

            if (chartType.value === 'dots') {
                this.markers.push({
                    time: chartDate,
                    position: 'inBar',
                    size: 1,
                    shape: 'circle',
                    value: data.price,
                    color: data.price > last(this.prices) ? PRICE_UP_COLOR : PRICE_DOWN_COLOR
                });
                this.series.setMarkers(this.markers);
            }
        }

        this.prevFloatingPrice = data.price;
        this.prices[this.prices.length - 1] = data.price;

        if (data.price < last(this.lowPrices)) {
            this.lowPrices[this.lowPrices.length - 1] = data.price;
        }
        if (data.price > last(this.highPrices)) {
            this.highPrices[this.highPrices.length - 1] = data.price;
        }

        this.series.update({
            time: chartDate,
            value: data.price,
            ...this.getCandlesData(chartType.value, {
                open: last(this.openPrices),
                low: last(this.lowPrices),
                high: last(this.highPrices),
                close: data.price,
                newCandle
            })
        });

        if (chartType.value === 'dots') {
            const newPriceColor = data.price > this.prices[this.prices.length - 2] ? PRICE_UP_COLOR : PRICE_DOWN_COLOR;
            this.series.applyOptions({
                priceLineColor: newPriceColor
            });

            if (newPriceColor !== last(this.markers).color) {
                this.markers[this.markers.length - 1].color = newPriceColor;
                this.series.setMarkers(this.markers);
            }
        }
    };

    render () {
        const { asset } = this.state;

        return <section className={styles.root}>
            <section className={styles.rootChart} ref={this.chartsContainer} />
            {
                !isEmpty(asset) &&
                <div className={styles.assetContainer}>
                    <div className={styles.assetTitle}>
                        {
                            CHART_SYMBOL_INFO_MAP[asset.assetName].title
                        }
                    </div>
                    <div className={styles.purchasePrice}>
                        <img src="/src/apps/client/ui/pages/MainPage/images/up.svg" />
                        <div>{formatPriceToString(asset.purchasePrice)}</div>
                    </div>
                    <div className={styles.sellingPrice}>
                        <img src="/src/apps/client/ui/pages/MainPage/images/down.svg" />
                        <div>{formatPriceToString(asset.sellingPrice)}</div>
                    </div>
                </div>
            }
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
