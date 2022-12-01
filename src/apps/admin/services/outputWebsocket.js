import io from 'socket.io-client';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';
import EventEmitter from 'eventemitter3';

const WEBSOCKET_URL = process.env.NODE_ENV === 'production' ? 'wss://room.megainvest.space:6060' : 'ws://localhost:6060';

class OutputWebsocketController {
    events = new EventEmitter();

    connect () {
        const socket = io(WEBSOCKET_URL, { transports: ['websocket'] });

        this.socket = socket;

        socket.on('connect', () => {
            const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

            socket.emit('token', {
                type: 'admin',
                token
            });
        });

        socket.on('output', data => {
            this.events.emit('output', data);
        });
    }

    disconnect () {
        this.socket && this.socket.disconnect();
        this.socket = null;
    }
}

const outputWebsocketController = new OutputWebsocketController();

export default outputWebsocketController;
