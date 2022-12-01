import { emailValidator, requiredValidator } from './validators';

export const userFieldsValidatorsMap = {
    name: [requiredValidator],
    surname: [requiredValidator],
    email: [requiredValidator, emailValidator],
    password: [requiredValidator],
    phone: [requiredValidator],
    date: [requiredValidator],
    country: [requiredValidator],
    accountNumber: [requiredValidator],
    accountStatus: [requiredValidator]
};
