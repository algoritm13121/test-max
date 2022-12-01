import {
    SET_AUTHENTICATION_POPUP,
    SET_USER,
    SET_ACCOUNT_INFO_POPUP,
    SET_PAYMENTS_POPUP,
    SET_ORDERS,
    SET_CURRENT_ASSET_DATA,
    SET_CURRENT_UPDATED_ASSET,
    SET_WITHDRAW_POPUP,
    SET_PAYMENTS
} from '../types/types';

const initialState = {
    authenticationFormPopup: {
        isPopup: false,
        activeIndex: 1
    },
    withdrawPopup: {
        visible: false,
        amount: ''
    },
    user: null,
    accountInfoPopup: false,
    paymentsPopup: false,
    openOrders: [],
    closedOrders: [],
    countClosedOrders: 0,
    currentAsset: {},
    currentUpdatedAsset: {},
    transactions: [],
    payments: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATION_POPUP:
        return { ...state, authenticationFormPopup: { ...state.authenticationFormPopup, isPopup: action.payload.isPopup, activeIndex: action.payload.index } };
    case SET_USER:
        return {
            ...state,
            ...(action.payload.user || action.payload.user === null ? { user: action.payload.user } : {}),
            ...(action.payload.openOrders ? { openOrders: action.payload.openOrders } : {}),
            ...(action.payload.closedOrders ? { closedOrders: action.payload.closedOrders } : {}),
            ...(action.payload.transactions ? { transactions: action.payload.transactions } : {}),
            ...(action.payload.payment ? { payments: action.payload.payment } : {}),
            ...(action.payload.countClosedOrders ? { countClosedOrders: action.payload.countClosedOrders } : 0)
        };
    case SET_ACCOUNT_INFO_POPUP:
        return { ...state, accountInfoPopup: action.payload };
    case SET_PAYMENTS_POPUP:
        return { ...state, paymentsPopup: action.payload };
    case SET_ORDERS:
        return { ...state, openOrders: action.payload.openOrders, closedOrders: action.payload.closedOrders };
    case SET_PAYMENTS:
        return { ...state, payments: action.payload[0] };
    case SET_CURRENT_ASSET_DATA:
        return { ...state, currentAsset: action.payload };
    case SET_CURRENT_UPDATED_ASSET:
        return { ...state, currentUpdatedAsset: action.payload };
    case SET_WITHDRAW_POPUP:
        return { ...state, withdrawPopup: { ...state.withdrawPopup, visible: action.payload.visible, amount: action.payload.amount } };
    default:
        return state;
    }
}
