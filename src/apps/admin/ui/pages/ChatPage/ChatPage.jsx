import React, { Component } from 'react';
import PropTypes from 'prop-types';

import last from '@tinkoff/utils/array/last';
import findIndex from '@tinkoff/utils/array/findIndex';

import TextField from '@material-ui/core/TextField/TextField';

import { connect } from 'react-redux';

import styles from './ChatPage.css';

import classNames from 'classnames';

import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisWeek from 'date-fns/isThisWeek';

import messageWebsocketController from '../../../services/messageWebsocket';
import getMessageHistory from '../../../services/getMessageHistory';
import getUsers from '../../../services/getUsers';
import editMessage from '../../../services/editMessage';
import getUnvisitedMessageHistory from '../../../services/getUnvisitedMessageHistory';

const mapDispatchToProps = (dispatch) => ({
    getMessageHistory: payload => dispatch(getMessageHistory(payload)),
    getUsers: payload => dispatch(getUsers(payload)),
    editMessage: payload => dispatch(editMessage(payload)),
    getUnvisitedMessageHistory: payload => dispatch(getUnvisitedMessageHistory(payload))
});

class MainPage extends Component {
    propTypes = {
        getMessageHistory: PropTypes.func.isRequired,
        getUsers: PropTypes.func.isRequired,
        editMessage: PropTypes.func.isRequired,
        getUnvisitedMessageHistory: PropTypes.func.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            value: '',
            search: '',
            messagesByUsers: [],
            showedMessagesByUsers: [],
            users: [],
            activeTabId: null
        };

        this.messagesWrapper = React.createRef();
    }

    componentDidMount () {
        messageWebsocketController.events.on('message', this.handleMessage);

        this.getData();
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevState.activeTabId !== this.state.activeTabId) {
            this.scrollToBottom();
        }
    }

    filterChatsBySearch = (chats, search = this.state.search) => {
        return chats.filter(messagesByUser => {
            const user = this.state.usersMap[messagesByUser.userId];
            const name = user && `${user.name} ${user.surname}`.toLowerCase();

            return !search || name && name.indexOf(search.toLowerCase()) !== -1;
        });
    };

    handleSearchChange = event => {
        const newValue = event.target.value;

        this.setState({
            search: newValue,
            showedMessagesByUsers: this.filterChatsBySearch(this.state.messagesByUsers, newValue)
        });
    };

    scrollToBottomNewMessage = () => {
        this.messagesWrapper.current.classList.remove(styles.noScrollWrapper);
        if (this.messagesWrapper.current.scrollHeight <= this.messagesWrapper.current.clientHeight) {
            this.messagesWrapper.current.classList.add(styles.noScrollWrapper);
        } else {
            this.messagesWrapper.current.scrollTop = this.messagesWrapper.current.scrollHeight;
        }
    };

    scrollToBottom () {
        this.messagesWrapper.current.scrollTop = this.messagesWrapper.current.scrollHeight;
    }

    componentWillUnmount () {
        messageWebsocketController.events.removeListener('message', this.handleMessage);
    }

    getData = () => {
        Promise.all([
            this.props.getMessageHistory(),
            this.props.getUsers()
        ])
            .then(([messages, users]) => {
                const allUsers = users.payload;

                this.setState({
                    users: allUsers,
                    usersMap: allUsers.reduce((result, user) => ({
                        ...result,
                        [user.id]: user
                    }), {})
                });

                const newMessagesByUsers = allUsers
                    .reduce((result, user) => {
                        const currentUserMessages = messages.filter((item) => { return user.id === item.senderId || user.id === item.receiverId; });
                        const sortedByDateMessages = currentUserMessages.reduce((acc, item) => {
                            if (acc[acc.length - 1][0]) {
                                let currentItemDate = format(item.createdAt, 'P');
                                let currentArrayDate = format(acc[acc.length - 1][0].createdAt, 'P');

                                if (currentArrayDate === currentItemDate) {
                                    acc[acc.length - 1].push(item);
                                } else acc.push([item]);
                            } else acc[acc.length - 1].push(item);

                            return acc;
                        }, [[]]);
                        const unvisitedMessages = currentUserMessages.filter((item) => {
                            return item.receiverId === 'admin' && !item.visited;
                        });

                        return [
                            ...result,
                            {
                                userId: user.id,
                                messages: sortedByDateMessages,
                                unvisitedMessagesCounter: unvisitedMessages.length
                            }
                        ];
                    }, [])
                    .sort((prev, next) => {
                        if (!prev.messages[0].length) {
                            return 1;
                        }
                        if (!next.messages[0].length) {
                            return 1;
                        }
                        return last(prev.messages[0]).createdAt - last(next.messages[0]).createdAt < 0 ? 1 : -1;
                    });

                this.setState({
                    activeTabId: newMessagesByUsers[0].userId,
                    messagesByUsers: newMessagesByUsers,
                    showedMessagesByUsers: newMessagesByUsers
                });
                this.scrollToBottom();
            });
    };

    handleMessage = message => {
        const { messagesByUsers } = this.state;
        const userId = message.senderId === 'admin' ? message.receiverId : message.senderId;

        const index = findIndex(messagesByUser => messagesByUser.userId === userId, messagesByUsers);

        if (index === -1) {
            messagesByUsers.unshift({ userId, messages: [message] });
        } else {
            messagesByUsers[index].messages[messagesByUsers[index].messages.length - 1].push(message);
            if (last(last(messagesByUsers[index].messages)).receiverId === 'admin') {
                messagesByUsers[index].unvisitedMessagesCounter = messagesByUsers[index].unvisitedMessagesCounter + 1;
            }
            const messagesByUser = messagesByUsers[index];

            messagesByUsers.splice(index, 1);
            messagesByUsers.unshift(messagesByUser);
        }

        this.setState({
            messagesByUsers,
            showedMessagesByUsers: this.filterChatsBySearch(messagesByUsers)
        }, () => this.scrollToBottomNewMessage());
    };

    handleSubmit = receiverId => event => {
        event.preventDefault();
        const { value } = this.state;

        messageWebsocketController.sendMessage({
            text: value,
            receiverId
        });

        this.setState({
            value: '',
            activeTabId: receiverId
        });
        this.scrollToBottom();
    };

    handleTabClick = (index, userId) => () => {
        const { messagesByUsers, showedMessagesByUsers } = this.state;
        const messagesByUsersIndex = findIndex(messagesByUser => messagesByUser.userId === userId, messagesByUsers);
        messagesByUsers[messagesByUsersIndex] = { ...messagesByUsers[messagesByUsersIndex], unvisitedMessagesCounter: 0 };
        const showedMessagesByUsersIndex = findIndex(messagesByUser => messagesByUser.userId === userId, showedMessagesByUsers);
        showedMessagesByUsers[showedMessagesByUsersIndex] = { ...showedMessagesByUsers[showedMessagesByUsersIndex], unvisitedMessagesCounter: 0 };

        this.setState({ activeTabId: userId, messagesByUsers, showedMessagesByUsers });
        this.props.editMessage({ id: userId })
            .then(this.props.getUnvisitedMessageHistory);
    };

    getDateHelper = (milliseconds) => {
        return `${format(milliseconds, 'd')} ${format(milliseconds, 'MMMM')}`;
    }

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    };

    render () {
        const { value, messagesByUsers, showedMessagesByUsers, activeTabId, usersMap, search } = this.state;

        return <div className={styles.content} style={{ position: 'relative' }}>
            <div>
                <TextField
                    label='Поиск по имени клиента'
                    fullWidth
                    value={search}
                    onChange={this.handleSearchChange}
                    margin='normal'
                    variant='outlined'
                    type='text'
                />
            </div>
            <form className={styles.messengerContainer} onSubmit={messagesByUsers.length ? this.handleSubmit(activeTabId) : undefined}>
                <div className={styles.contacts}>
                    {showedMessagesByUsers.map((messagesByUser, i) => {
                        const user = usersMap[messagesByUser.userId];
                        const lastMessage = messagesByUser.messages ? last(messagesByUser.messages[messagesByUser.messages.length - 1]) : undefined;

                        return <div className={classNames(styles.contact, { [styles.active]: activeTabId === messagesByUser.userId })}
                            key={i} onClick={this.handleTabClick(i, user.id)}>
                            <div className={styles.info}>
                                <h1 className={styles.userFullName}>{user.name} {user.surname}</h1>
                                <div className={styles.lastMessage}>
                                    {
                                        lastMessage && lastMessage.senderId === 'admin' &&
                                        <div className={styles.messageYou}>Вы:</div>
                                    }
                                    {lastMessage && <div className={styles.text}>{lastMessage.text}</div>}
                                    {lastMessage &&
                                        <div className={styles.date}>
                                            {isToday(lastMessage.createdAt)
                                                ? format(lastMessage.createdAt, 'HH:mm')
                                                : isThisWeek(lastMessage.createdAt)
                                                    ? format(lastMessage.createdAt, 'EEEE')
                                                    : format(lastMessage.createdAt, 'P')
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            {messagesByUser.unvisitedMessagesCounter
                                ? <span className={styles.rate}>
                                    {messagesByUser.unvisitedMessagesCounter}
                                </span>
                                : undefined}
                        </div>;
                    })}
                </div>
                <div className={styles.messages}>
                    <div ref={this.messagesWrapper} className={styles.messagesWrapper}>
                        {(messagesByUsers.find(messagesByUser => messagesByUser.userId === activeTabId) || { messages: [] }).messages.map((item, i) => {
                            if (item.length) {
                                return <div className={styles.messagesContainer} data-attr={this.getDateHelper(item[0].createdAt)}>
                                    {item.map((message, i) => {
                                        const isMyMessage = message.senderId === 'admin';
                                        const user = usersMap[message.senderId];

                                        return <div key={i} className={classNames(styles.message, { [styles.messageYou]: isMyMessage })}>
                                            <div className={styles.messageContent}>
                                                <div className={styles.messageContentTop}>
                                                    <div className={styles.messageName}>
                                                        {!isMyMessage ? `${user.name} ${user.surname}` : 'Админ'}
                                                    </div>
                                                    {
                                                        // please check, there is no type in messagesByUser.messages
                                                        !isMyMessage && <div className={styles.messageType}>
                                                            {/* {text[messagesByUsers[activeTab].userId.type]} */}
                                                        </div>
                                                        //
                                                    }
                                                    <div className={styles.messageDate}>
                                                        {
                                                            isMyMessage &&
                                                            <span className={styles.receivedIcon}>

                                                                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    {/* eslint-disable-next-line max-len */}
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.97016 0.969982C7.11011 0.831254 7.29903 0.753178 7.49609 0.752634C7.69315 0.752091 7.8825 0.829123 8.02321 0.967077C8.16392 1.10503 8.24469 1.29282 8.24805 1.48985C8.25141 1.68688 8.17709 1.87731 8.04116 2.01998L4.04916 7.00998C3.98055 7.08388 3.89774 7.14318 3.80569 7.18435C3.71364 7.22551 3.61423 7.24769 3.51341 7.24956C3.41259 7.25143 3.31243 7.23294 3.21891 7.19521C3.1254 7.15749 3.04046 7.10129 2.96916 7.02998L0.324157 4.38398C0.250471 4.31532 0.191368 4.23252 0.150376 4.14052C0.109384 4.04852 0.0873427 3.94921 0.0855659 3.8485C0.0837892 3.7478 0.102314 3.64777 0.140035 3.55438C0.177756 3.461 0.2339 3.37616 0.305119 3.30494C0.376338 3.23373 0.461172 3.17758 0.55456 3.13986C0.647948 3.10214 0.747977 3.08361 0.84868 3.08539C0.949383 3.08717 1.0487 3.10921 1.1407 3.1502C1.2327 3.19119 1.3155 3.2503 1.38416 3.32398L3.47816 5.41698L6.95016 0.991982C6.95639 0.984262 6.96306 0.976915 6.97016 0.969982ZM6.05016 6.10998L6.97016 7.02998C7.04144 7.10113 7.12632 7.1572 7.21974 7.19484C7.31316 7.23247 7.4132 7.25091 7.5139 7.24904C7.6146 7.24717 7.71389 7.22504 7.80585 7.18397C7.89781 7.1429 7.98056 7.08373 8.04916 7.00998L12.0412 2.01998C12.1129 1.94918 12.1696 1.86466 12.2079 1.77146C12.2462 1.67826 12.2654 1.57829 12.2642 1.47752C12.263 1.37676 12.2415 1.27726 12.2011 1.18498C12.1606 1.0927 12.1019 1.00952 12.0286 0.940411C11.9552 0.871304 11.8687 0.817686 11.7742 0.782758C11.6797 0.74783 11.5791 0.73231 11.4784 0.737123C11.3778 0.741937 11.2791 0.766986 11.1883 0.810774C11.0976 0.854562 11.0166 0.916192 10.9502 0.991982L7.47716 5.41698L6.99216 4.93098L6.04916 6.10998H6.05016Z" fill="#00C7C7" />
                                                                </svg>
                                                            </span>
                                                        }
                                                        {format(message.createdAt, 'HH:mm')}
                                                    </div>
                                                </div>
                                                <div className={styles.messageText}>{message.text}</div>
                                            </div>
                                        </div>;
                                    })}
                                </div>;
                            }
                        })}
                    </div>
                    <div className={styles.messageInput}>
                        <div className={styles.inputWrapper}>
                            <input className={styles.input} value={value} onChange={this.handleChange} type="text" />
                        </div>
                        {value ? <button className={styles.button} type='submit' >Отправить</button>
                            : <button className={styles.buttonDisabled} type='button' >Отправить</button>}
                    </div>
                </div>
            </form >
        </div >;
    }
}

export default connect(undefined, mapDispatchToProps)(MainPage);
