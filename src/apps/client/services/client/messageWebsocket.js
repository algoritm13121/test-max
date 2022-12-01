import io from 'socket.io-client';

import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';
import EventEmitter from 'eventemitter3';
import { AUTO_CLOSE_ORDER_EVENT, AUTO_CLOSE_ORDER_EVENT_CLIENT, DOMAIN } from '../../../../../server/constants/constants';

const WEBSOCKET_URL = process.env.NODE_ENV === 'production' ? `wss://${DOMAIN}:2053` : 'ws://localhost:2053';

class MessageWebsocketController {
    events = new EventEmitter();

    connect () {
        if (this.socket) {
            return;
        }
        const socket = io(WEBSOCKET_URL, { transports: ['websocket'] });

        this.socket = socket;

        socket.on('connect', () => {
            const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

            socket.emit('token', {
                type: 'client',
                token
            });
        });

        socket.on('message', data => {
            this.events.emit('message', data);
        });

        socket.on(AUTO_CLOSE_ORDER_EVENT, data => this.events.emit(AUTO_CLOSE_ORDER_EVENT_CLIENT, data));
    }

    disconnect () {
        this.socket && this.socket.disconnect();
        this.socket = null;
    }

    sendMessage ({ text }) {
        if (!this.socket) {
            return;
        }

        this.socket.emit('message', {
            text
        });
    }
}

const messageWebsocketController = new MessageWebsocketController();

export default messageWebsocketController;
