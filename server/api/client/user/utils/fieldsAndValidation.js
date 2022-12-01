import { emailValidator, requiredValidator } from './validators';

export const userFieldsValidatorsMap = {
    name: [requiredValidator],
    surname: [requiredValidator],
    email: [requiredValidator, emailValidator],
    password: [requiredValidator],
    phone: [requiredValidator],
    date: [requiredValidator],
    city: [requiredValidator],
    address: [requiredValidator],
    gender: [requiredValidator],
    country: [requiredValidator],
    accountNumber: [requiredValidator],
    accountStatus: [requiredValidator],
    id: [requiredValidator]
};
