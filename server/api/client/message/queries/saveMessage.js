import Message from '../model';

export default function saveMessage (message) {
    return Message.create(message);
}
