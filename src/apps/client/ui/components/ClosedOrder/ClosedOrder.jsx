import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import format from 'date-fns/format';

import styles from './ClosedOrder.css';

import { CHART_SYMBOL_INFO_MAP } from '../../../../../../server/constants/symbols';
import formatPriceToString from '../../../utils/formatPriceToString';
import formatNumberToString from '../../../utils/formatNumberToString';

import getRoundValue from '../../../utils/getRoundValue';

class ClosedOrder extends PureComponent {
    static propTypes = {
        item: PropTypes.object.isRequired,
        orderIndex: PropTypes.number.isRequired
    };

    getDate = currentDate => {
        const date = new Date(currentDate);

        return format(date, 'dd.MM.yyyy');
    };

    getTime = time => {
        const date = new Date(time);
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();

        return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`;
    };

    render () {
        const { item, orderIndex } = this.props;

        return <div className={styles.footerItemTable}>
            <div className={classNames(styles.itemNum, styles.footerItems)}>{orderIndex + 1}</div>
            <div className={classNames(styles.itemCreateDate, styles.footerItems)}>{this.getDate(item.createdAt)}</div>
            <div className={classNames(styles.itemCloseDate, styles.footerItems)}>{this.getDate(item.closedAt)}</div>
            <div className={classNames(styles.itemAsset, styles.footerItems)}>
                {
                    CHART_SYMBOL_INFO_MAP[item.assetName].imgAlone
                        ? <div className={styles.assetItemPair}>
                            <img
                                className={styles.imgAlone}
                                src={CHART_SYMBOL_INFO_MAP[item.assetName].imgAlone}
                                alt="asset"
                            />
                        </div>
                        : <div className={styles.assetItemPair}>
                            <img
                                className={styles.imgUpper}
                                src={CHART_SYMBOL_INFO_MAP[item.assetName].imgTop}
                                alt="assets"
                            />
                            <img
                                className={styles.imgLower}
                                src={CHART_SYMBOL_INFO_MAP[item.assetName].imgBottom}
                                alt="assets"
                            />
                        </div>
                }
                {
                    CHART_SYMBOL_INFO_MAP[item.assetName].title
                }
                <img
                    className={styles.secondImg}
                    src={item.type === 'buy'
                        ? '/src/apps/client/ui/components/Footer/images/arrowUp.svg'
                        : '/src/apps/client/ui/components/Footer/images/arrowDown.svg'}
                    alt=""
                />
            </div>
            <div className={classNames(styles.itemAmount, styles.footerItems)}>{formatNumberToString(item.amount)}</div>
            <div className={classNames(styles.itemPledge, styles.footerItems)}>$ {formatNumberToString(item.pledge)}</div>
            <div className={classNames(styles.itemOpeningRate, styles.footerItems)}>
                {formatPriceToString(item.openingPrice)}
            </div>
            <div className={classNames(styles.itemClosingRate, styles.footerItems)}>
                {formatPriceToString(item.closedPrice)}
                <div className={classNames(styles.itemDiffRate, {
                    [styles.posValue]: item.diffPrice > 0,
                    [styles.negValue]: item.diffPrice < 0
                })}>{item.diffPrice > 0 && '+'} {formatPriceToString(item.diffPrice)}</div>
            </div>
            <div className={classNames(styles.itemProfit, styles.footerItems, {
                [styles.posValue]: item.profit > 0,
                [styles.negValue]: item.profit < 0
            })}>$ {formatNumberToString(item.profit)}</div>
            <div className={classNames(styles.itemCommission, styles.footerItems)}>$ {getRoundValue(item.commission, 2)}</div>
            <div className={classNames(styles.profitAndLoss, styles.footerItems)}>{item.takeProfit}</div>
            <div className={classNames(styles.profitAndLoss, styles.footerItems)}>{item.stopLoss}</div>
            <div className={classNames(styles.itemClosingDate, styles.footerItems)}>{this.getTime(item.closedAt)}</div>
        </div>;
    }
}

export default ClosedOrder;
