import pick from '@tinkoff/utils/object/pick';

const VALUES = ['userId', 'amount', 'status', 'date', 'id', 'visited'];

export default function prepareMoneyOutput (body) {
    return pick(VALUES, body);
}
