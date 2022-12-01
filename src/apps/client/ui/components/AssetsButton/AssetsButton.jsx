import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import setChartSymbolGroup from '../../../actions/setChartSymbolGroup';
import setChartSymbol from '../../../actions/setChartSymbol';
import assetPriceWebsocketController from '../../../services/client/assetPriceWebsocket';

import propOr from '@tinkoff/utils/object/propOr';

import { CHART_SYMBOL_GROUPS } from '../../../../../../server/constants/symbols';
import { SCROLL_TOP_LOCKED_EVENT_NAME } from '../../../constants/constants';

import styles from './AssetsButton.css';
import BuyAndSellComponent from '../BuyAndSellComponent/BuyAndSellComponent';
import formatPriceToString from '../../../utils/formatPriceToString';
import outsideClick from '../../hocs/outsideClick.jsx';

import isEmpty from '@tinkoff/utils/is/empty';

const mapStateToProps = ({ application, charts, data }) => {
    return {
        langMap: application.langMap,
        chartSymbolGroup: charts.chartSymbolGroup,
        chartSymbol: charts.chartSymbol,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    setChartSymbolGroup: payload => dispatch(setChartSymbolGroup(payload)),
    setChartSymbol: payload => dispatch(setChartSymbol(payload))
});

@outsideClick
class AssetsButton extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        chartSymbolGroup: PropTypes.object.isRequired,
        setChartSymbolGroup: PropTypes.func.isRequired,
        setChartSymbol: PropTypes.func.isRequired,
        events: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        user: PropTypes.object
    };

    state = {
        isAssetsOpen: false,
        isInnerAssetsButtonOpen: false,
        textSearch: '',
        filteredChartSymbolGroup: this.props.chartSymbolGroup.symbols,
        currentActiveMobileAsset: {}
    };

    componentDidMount () {
        this.props.events.on(SCROLL_TOP_LOCKED_EVENT_NAME, () => this.setState({ isAssetsOpen: false }));
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.state.isAssetsOpen !== prevState.isAssetsOpen && this.state.isAssetsOpen) {
            assetPriceWebsocketController.events.on('data', this.handlePriceChange);
        } else if (this.state.isAssetsOpen !== prevState.isAssetsOpen && !this.state.isAssetsOpen) {
            assetPriceWebsocketController.events.off('data', this.handlePriceChange);
        }

        if (this.state.isAssetsOpen && !this.props.outsideClickEnabled) {
            this.props.turnOnClickOutside(this, () => {
                this.setState({
                    isAssetsOpen: false,
                    isInnerAssetsButtonOpen: false,
                    textSearch: ''
                });
            });
        }
    }

    handlePriceChange = data => {
        const { filteredChartSymbolGroup } = this.state;

        if (filteredChartSymbolGroup.every(chartSymbol => chartSymbol.name !== data.name)) {
            return;
        }

        this.forceUpdate();
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.chartSymbolGroup !== nextProps.chartSymbolGroup) {
            this.setState({
                filteredChartSymbolGroup: nextProps.chartSymbolGroup.symbols,
                textSearch: ''
            }, () => {
                this.filterList();
            });
        }
    }

    handlerMenu = () => {
        if (!this.state.isAssetsOpen) {
            this.props.events.emit(SCROLL_TOP_LOCKED_EVENT_NAME);
        }
        this.filterList();

        this.setState({
            isAssetsOpen: !this.state.isAssetsOpen,
            isInnerAssetsButtonOpen: false,
            textSearch: ''
        });
    };

    handlerAssetsInnerButton = () => {
        this.setState({ isInnerAssetsButtonOpen: !this.state.isInnerAssetsButtonOpen });
    };

    handleSymbolGroupSelect = symbolGroup => () => {
        this.props.setChartSymbolGroup(symbolGroup);
    };

    handleSymbolSelect = symbol => () => {
        this.props.setChartSymbol(symbol);

        this.setState({
            filteredChartSymbolGroup: this.state.filteredChartSymbolGroup.map(chartSymbol => chartSymbol.name === symbol.name
                ? ({
                    ...chartSymbol,
                    isActive: true
                })
                : ({
                    ...chartSymbol,
                    isActive: false
                })),
            currentActiveMobileAsset: symbol
        });
    };

    handleSearch = event => {
        const textSearch = event.target.value;
        this.setState({ textSearch }, this.filterList);
    };

    filterList = () => {
        const filteredChartSymbolGroup =
            this.props.chartSymbolGroup.symbols.filter(chart => chart.title.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) !== -1);
        this.setState({ filteredChartSymbolGroup });
    };

    render () {
        const { langMap, chartSymbolGroup, user } = this.props;
        const { isAssetsOpen, isInnerAssetsButtonOpen, filteredChartSymbolGroup, textSearch } = this.state;
        const text = propOr('menu', {}, langMap);

        return <div className={styles.root}>
            <div className={classNames(styles.menuContent, {
                [styles.menuOpen]: isAssetsOpen
            })}>
                <div className={styles.title}>{text.assetsTitle}</div>
                <div className={styles.contentContainer}>
                    <div className={styles.contentItem} onClick={this.handlerAssetsInnerButton}>
                        <div className={classNames(styles.contentItemText, {
                            [styles.contentItemTextActive]: isInnerAssetsButtonOpen
                        })}>
                            <div className={styles.iconContainer}>
                                <img src={chartSymbolGroup.img} />
                            </div>
                            {chartSymbolGroup.title}
                            <div className={classNames(styles.iconArrow, {
                                [styles.iconArrowActive]: isInnerAssetsButtonOpen
                            })}>
                                <img src="/src/apps/client/ui/components/AssetsButton/images/arrowDown.svg" alt="" />
                            </div>
                        </div>
                        <div className={classNames(styles.innerAssetsContainer, {
                            [styles.innerAssetsButtonVisible]: isInnerAssetsButtonOpen
                        })}>
                            {CHART_SYMBOL_GROUPS
                                .filter(symbolGroup => symbolGroup.id !== chartSymbolGroup.id)
                                .map((item, i) => <div key={i} className={styles.assetsItem} onClick={this.handleSymbolGroupSelect(item)}>
                                    <div className={styles.iconContainer}>
                                        <img src={item.img} />
                                    </div>
                                    {item.title}
                                </div>)}
                        </div>
                    </div>
                    <div className={styles.contentItem}>
                        <div className={styles.contentItemText}>
                            <input
                                value={textSearch}
                                onChange={this.handleSearch}
                                placeholder={text.assetsSearch}
                                className={styles.searchField}
                                type="text"
                            />
                            <div className={classNames(styles.iconArrow)}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M5.13149 10.263C6.27003 10.2628 7.37576 9.88161 8.27261 9.18024L11.0924 12L11.9994 11.093L9.1796 8.27325C9.88133 7.37631 10.2627 6.27033 10.263 5.13149C10.263 2.30212 7.96087 0 5.13149 0C2.30212 0 0 2.30212 0 5.13149C0 7.96087 2.30212 10.263 5.13149 10.263ZM5.13149 1.28287C7.25401 1.28287 8.98012 3.00898 8.98012 5.13149C8.98012 7.25401 7.25401 8.98012 5.13149 8.98012C3.00898 8.98012 1.28287 7.25401 1.28287 5.13149C1.28287 3.00898 3.00898 1.28287 5.13149 1.28287Z" fill="#F8F8F8" fillOpacity="0.5" />
                                </svg>
                            </div>
                            <div className={styles.assetsContainer}>
                                {filteredChartSymbolGroup.map((asset, i) =>
                                    <div key={i} className={classNames(styles.assetItemContainer,
                                        { [styles.assetItemContainerActive]: asset.isActive },
                                        { [styles.contentCenter]: isEmpty(user) }
                                    )} onClick={this.handleSymbolSelect(asset)}>
                                        <div className={styles.assetItemDataContainer}>
                                            {
                                                asset.imgAlone
                                                    ? <div className={styles.assetItemPair}>
                                                        <img className={styles.imgAlone} src={asset.imgAlone} alt="asset"/>
                                                    </div>
                                                    : <div className={styles.assetItemPair}>
                                                        <img className={styles.imgUpper} src={asset.imgTop} alt="assets"/>
                                                        <img className={styles.imgLower} src={asset.imgBottom} alt="assets"/>
                                                    </div>
                                            }
                                            <div className={styles.assetsName}>{asset.title}</div>
                                            <div className={classNames(styles.assetsPrice, {
                                                [styles.posPrice]: assetPriceWebsocketController.changes[asset.name] === 'up',
                                                [styles.negPrice]: assetPriceWebsocketController.changes[asset.name] === 'down'
                                            })}>{formatPriceToString(assetPriceWebsocketController.prices[asset.name])}</div>
                                        </div>
                                        {(asset.isActive && !isEmpty(user)) &&
                                        <div className={styles.mobileBuyAndSell}><BuyAndSellComponent activeAsset={asset} /></div>}
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classNames(styles.buttonContainer, {
                [styles.buttonActive]: isAssetsOpen
            })} onClick={this.handlerMenu}>
                <svg className={classNames(styles.buttonImg, {
                    [styles.buttonImgActive]: isAssetsOpen
                })} width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* eslint-disable-next-line max-len */}
                    <path d="M8.69998 12.35C5.29498 11.465 4.19998 10.55 4.19998 9.125C4.19998 7.49 5.71498 6.35 8.24998 6.35C10.92 6.35 11.91 7.625 12 9.5H15.315C15.21 6.92 13.635 4.55 10.5 3.785V0.5H5.99998V3.74C3.08998 4.37 0.74998 6.26 0.74998 9.155C0.74998 12.62 3.61498 14.345 7.79998 15.35C11.55 16.25 12.3 17.57 12.3 18.965C12.3 20 11.565 21.65 8.24998 21.65C5.15998 21.65 3.94498 20.27 3.77998 18.5H0.47998C0.65998 21.785 3.11998 23.63 5.99998 24.245V27.5H10.5V24.275C13.425 23.72 15.75 22.025 15.75 18.95C15.75 14.69 12.105 13.235 8.69998 12.35Z" fill="#A6B1DC" />
                </svg>
                <div className={classNames(styles.button, {
                    [styles.buttonTitleActive]: isAssetsOpen
                })}>{text.assets}</div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetsButton);
