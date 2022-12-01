export const getOpeningSlotPrice = (asset, openingPrice) => (openingPrice * asset.lotVolume) / asset.leverage;
export const getPledge = (amount, openingSlotPrice) => amount * openingSlotPrice;
export const getProfit = (amount, openingPrice, price, type, asset) =>
    (type === 'buy' ? (price - openingPrice) : (openingPrice - price)) * amount * asset.lotVolume;
export const getBalance = (balance, profit, commissionValue) => balance + profit - commissionValue;
export const getFreeBalance = (balance, pledge) => balance - pledge;
export const getCommission = (pledge, commission) => pledge * commission;

export default (asset, { openingPrice, amount, type }, price, balance, commission) => {
    const openingSlotPrice = getOpeningSlotPrice(asset, openingPrice);
    const pledge = getPledge(amount, openingSlotPrice);
    const profit = getProfit(amount, openingPrice, price, type, asset);
    const commissionValue = getCommission(pledge, commission);
    const newBalance = getBalance(balance, profit, commissionValue);
    const freeBalance = getFreeBalance(balance, pledge);

    return {
        openingSlotPrice,
        commissionValue,
        balance: newBalance,
        freeBalance,
        pledge,
        profit
    };
};
