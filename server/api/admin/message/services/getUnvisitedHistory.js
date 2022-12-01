import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getMessagesQuery from '../../../client/message/queries/getMessages';

export default function getHistory (req, res) {
    try {
        return getMessagesQuery()
            .then(messages => {
                const unvisitedMessages = messages.filter((item) => {
                    return item.senderId !== 'admin' && item.visited === false;
                });

                const unvisitedMessagesGoup = unvisitedMessages.reduce((acc, item) => {
                    if (acc.length === 0) { acc.push([item]); } else {
                        const index = acc.findIndex((accItem) => { return accItem[0].senderId === item.senderId; });
                        index !== -1 ? acc[index].push(item) : acc.push([item]);
                    }
                    return acc;
                }, []);

                return res.status(OKEY_STATUS_CODE).send(unvisitedMessagesGoup);
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
