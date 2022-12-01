import pick from '@tinkoff/utils/object/pick';

const VALUES = ['id', 'userId', 'dirName', 'value', 'content', 'type'];

export default function prepareTransaction (body) {
    return pick(VALUES, body);
}
