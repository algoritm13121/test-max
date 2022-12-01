import { requiredValidator, typeValidator } from './validators';

export const orderFieldsValidatorsMap = {
    assetName: [requiredValidator],
    amount: [requiredValidator],
    pledge: [requiredValidator],
    openingPrice: [requiredValidator],
    type: [typeValidator]
};
