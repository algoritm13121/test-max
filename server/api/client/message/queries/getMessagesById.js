import Message from '../model';

export default function getMessagesById (id) {
    return Message.find({ '$or': [{ senderId: id }, { receiverId: id }] });
}
