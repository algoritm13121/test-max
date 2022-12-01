import Message from '../model';

export default function getMessagesById (id) {
    return Message.updateMany({ receiverId: id }, { visited: true });
}
