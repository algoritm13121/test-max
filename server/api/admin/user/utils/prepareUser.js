import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'positionIndex',
    'blocked',
    'id',
    'dirName',
    'name',
    'surname',
    'accountNumber',
    'email',
    'phone',
    'accountStatus',
    'country',
    'city',
    'address',
    'password',
    'docs',
    'isActive',
    'isVipStatus'
];

export default function prepareUser (body) {
    return pick(VALUES, body);
}
