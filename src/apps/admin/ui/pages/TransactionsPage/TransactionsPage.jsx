import React, { Component } from 'react';
import PropTypes from 'prop-types';

import pathOr from '@tinkoff/utils/object/pathOr';

import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import MoneyOutputForm from '../../components/MoneyOutputForm/MoneyOutputForm.jsx';

import { connect } from 'react-redux';
import getUsers from '../../../services/getUsers';
import getMoneyOutput from '../../../services/getMoneyOutput';
import editMoneyOutput from '../../../services/editMoneyOutput';
import deleteMoneyOutput from '../../../services/deleteOutputsByIds';
import outputWebsocketController from '../../../services/outputWebsocket';
import getUnvisitedMoneyOutput from '../../../services/getUnvisitedMoneyOutput';

const headerRows = [
    { id: 'name', label: 'Имя' },
    { id: 'amount', label: 'Сумма' },
    { id: 'status', label: 'Статус' }
];

const materialStyles = theme => ({
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width:1300px)': {
            width: '90%'
        }
    },
    warningContent: {
        paddingBottom: '0'
    },
    columnName: {
        maxWidth: '400px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width:1020px)': {
            maxWidth: '200px'
        },
        '@media (max-width:750px)': {
            maxWidth: '100px'
        },
        '@media (max-width:340px)': {
            maxWidth: '80px'
        }
    },
    columnAlias: {
        maxWidth: '200px',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width:850px)': {
            maxWidth: '100px'
        },
        '@media (max-width:400px)': {
            maxWidth: '50px'
        }
    }
});

const mapStateToProps = ({ data }) => {
    return {
        output: data.output
    };
};

const mapDispatchToProps = (dispatch) => ({
    getUsers: payload => dispatch(getUsers(payload)),
    getMoneyOutput: payload => dispatch(getMoneyOutput(payload)),
    editMoneyOutput: payload => dispatch(editMoneyOutput(payload)),
    deleteMoneyOutput: payload => dispatch(deleteMoneyOutput(payload)),
    getUnvisitedMoneyOutput: payload => dispatch(getUnvisitedMoneyOutput(payload))
});

class TransactionsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getUsers: PropTypes.func.isRequired,
        getMoneyOutput: PropTypes.func.isRequired,
        editMoneyOutput: PropTypes.func.isRequired,
        deleteMoneyOutput: PropTypes.func.isRequired,
        getUnvisitedMoneyOutput: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editableUser: null
        };
        this.tableCells = [
            { prop: user => <div className={this.props.classes.columnName}>{pathOr(['name'], '', user)} {pathOr(['surname'], '', user)}</div> },
            { prop: user => <div className={this.props.classes.columnName}>{pathOr(['amount'], '', user)}</div> },
            { prop: user => <div className={this.props.classes.columnName}>{pathOr(['status'], '', user)}</div> }
        ];
    }

    getData = () => {
        return Promise.all([
            this.props.getMoneyOutput(),
            this.props.getUsers(false)
        ])
            .then(([outputs, users]) => {
                this.setState({
                    loading: false,
                    outputByUsers:
                        outputs.payload.reduce((acc, item) => {
                            const user = users.payload.find((user) => { return user.id === item.userId; });

                            if (user) {
                                acc.push({
                                    name: user.name,
                                    surname: user.surname,
                                    status: item.status,
                                    date: item.createdAt,
                                    createdAtDate: item.createdAtDate,
                                    amount: item.amount,
                                    id: item.id,
                                    visited: item.visited
                                });
                            }

                            return acc;
                        }, [])
                });
            });
    }

    componentDidMount () {
        outputWebsocketController.events.on('output', this.qwerty);

        this.getData();
    }

    componentWillUnmount () {
        outputWebsocketController.events.removeListener('output', this.qwerty);
    }

    qwerty = output => {
        this.props.getUsers(false)
            .then((users) => {
                const user = users.payload.find((user) => { return user.id === output.userId; });

                this.setState({
                    outputByUsers: [...this.state.outputByUsers, {
                        date: output.createdAt,
                        createdAtDate: output.createdAtDate,
                        name: user.name,
                        surname: user.surname,
                        status: output.status,
                        amount: output.amount,
                        id: output.id,
                        visited: output.visited
                    }]
                });
            });
    }

    handleFormDone = () => {
        this.getData()
            .then(this.handleCloseUserForm);
    };

    handleFormOpen = user => () => {
        this.setState({
            formShowed: true,
            editableUser: user
        });
        this.props.editMoneyOutput({ ...user, visited: true }).then(this.getData());
        this.props.getUnvisitedMoneyOutput();
    };

    handleCloseUserForm = () => {
        this.setState({
            formShowed: false,
            editableUser: null
        });
    };

    handleOutputDelete = ids => {
        return this.props.deleteMoneyOutput(ids)
            .then(() => {
                this.getData();
                this.props.getUnvisitedMoneyOutput();
            });
    };

    render () {
        const { classes } = this.props;
        const { loading, editableUser, formShowed, outputByUsers } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={this.tableCells}
                values={outputByUsers.sort((prev, next) => next.createdAtDate - prev.createdAtDate)}
                headerText='Запросы на вывод'
                deleteValueWarningTitle='Вы точно хотите удалить запрос?'
                deleteValuesWarningTitle='Вы точно хотите удалить запросы?'
                onDelete={this.handleOutputDelete}
                onFormOpen={this.handleFormOpen}
                isAddButton={false}
            />
            <Modal open={formShowed} onClose={this.handleCloseUserForm} className={classes.modal} disableEnforceFocus>
                <Paper className={classes.modalContent}>
                    <MoneyOutputForm user={editableUser} onDone={this.handleFormDone} />
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(TransactionsPage));
