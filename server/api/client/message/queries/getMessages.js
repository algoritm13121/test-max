import Message from '../model';

export default function getMessages () {
    return Message.find({});
}
