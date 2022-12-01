import Message from '../../../client/message/model';

export default function getMessagesById (id) {
    return Message.updateMany({ '$or': [{ senderId: id }, { receiverId: id }] }, { visited: true });
}
