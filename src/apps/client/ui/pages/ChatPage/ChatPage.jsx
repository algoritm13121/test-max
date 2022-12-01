import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import getMessageHistory from '../../../services/client/getMessageHistory';
import editMessage from '../../../services/client/editMessage';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisWeek from 'date-fns/isThisWeek';

import messageWebsocketController from '../../../services/client/messageWebsocket';

import styles from './ChatPage.css';

const mapStateToProps = ({ data }) => {
    return {
        userId: data.user.id
    };
};

const mapDispatchToProps = (dispatch) => ({
    getMessageHistory: payload => dispatch(getMessageHistory(payload)),
    editMessage: payload => dispatch(editMessage(payload))
});

class ChatPage extends Component {
    propTypes = {
        getMessageHistory: PropTypes.func.isRequired,
        closeChatHandler: PropTypes.func.isRequired,
        editMessage: PropTypes.func.isRequired,
        userId: PropTypes.string
    };

    constructor (props) {
        super(props);

        this.state = {
            value: '',
            messages: []
        };

        this.messagesContainer = React.createRef();
    }

    componentDidMount () {
        messageWebsocketController.events.on('message', this.handleMessage);

        this.props.getMessageHistory()
            .then(messages => {
                this.setState({
                    messages: messages.sort((prev, next) => prev.createdAt - next.createdAt)
                }, () => this.handleScrollToBottom());
            });
        this.props.editMessage({ id: this.props.userId });
    }

    componentWillUnmount () {
        messageWebsocketController.events.removeListener('message', this.handleMessage);
    }

    handleMessage = message => {
        const { messages } = this.state;

        this.setState({
            messages: [
                ...messages,
                message
            ]
        }, () => this.handleScrollToBottom());
    };

    handleSubmit = event => {
        event.preventDefault();

        const { value } = this.state;

        messageWebsocketController.sendMessage({
            text: value
        });

        this.setState({
            value: ''
        });
    };

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    };

    closeChat = () => {
        this.props.closeChatHandler();
    }

    handleScrollToBottom = () => {
        this.messagesContainer.current.classList.remove(styles.noScrollWrapper);
        if (this.messagesContainer.current.scrollHeight <= this.messagesContainer.current.clientHeight) {
            this.messagesContainer.current.classList.add(styles.noScrollWrapper);
        } else {
            this.messagesContainer.current.scrollTop = this.messagesContainer.current.scrollHeight;
        }
    };

    render () {
        const { value, messages } = this.state;
        return <div className={styles.chatContainer} >
            <div className={styles.titleContainer}>
                <h4 className={styles.title}>Чат</h4>
            </div>
            <div ref={this.messagesContainer} className={styles.messagesContainer}>
                <div className={styles.invisible} />
                {messages.map((message, i) => {
                    const isMyMessage = message.receiverId === 'admin';

                    return <div className={isMyMessage ? styles.messageContainer : styles.messageContainerAdmin} key={i}>
                        <div className={isMyMessage ? styles.avatar : styles.avatarAdmin}>
                            <img className={styles.image} src='/src/apps/client/ui/pages/ChatPage/images/Avatar.svg' alt="" />
                        </div>
                        <div className={isMyMessage ? styles.messageInfo : styles.messageInfoAdmin}>
                            <div className={styles.senderTime}>
                                <div className={styles.sender}>{isMyMessage ? 'Вы' : 'Админ'}</div>
                                <div className={styles.timeSent}>
                                    {isToday(message.createdAt)
                                        ? format(message.createdAt, 'HH:mm')
                                        : isThisWeek(message.createdAt)
                                            ? format(message.createdAt, 'EEEE')
                                            : format(message.createdAt, 'P')
                                    }
                                </div>
                            </div>
                            <div className={styles.messageText}>{message.text}</div>
                        </div>
                    </div>;
                })}
            </div>
            <div className={styles.inputContainer}>
                <form onSubmit={this.handleSubmit}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.input}>
                            <input placeholder='Введите сообщение' value={value} onChange={this.handleChange} type="text" />
                        </div>
                        <div className={styles.button}>
                            <button type='submit'>
                                <img src='/src/apps/client/ui/pages/ChatPage/images/Triangle.svg' alt="Отправить" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className={styles.closeChat} onClick={this.closeChat} />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
