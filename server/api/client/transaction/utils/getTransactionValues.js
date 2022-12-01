import pick from '@tinkoff/utils/object/pick';

const VALUES = [
    'id',
    'userId',
    'value',
    'content'
];

export default function getQuestionValues (question) {
    return pick(VALUES, question);
}
