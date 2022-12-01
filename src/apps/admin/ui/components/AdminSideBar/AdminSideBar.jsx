import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import noop from '@tinkoff/utils/function/noop';

const materialStyles = theme => ({
    paper: {
        margin: '30px 0 0 30px',
        display: 'inline-block',
        paddingRight: theme.spacing.unit,
        '@media (max-width:1200px)': {
            paddingRight: '0',
            margin: '30px 0 0 0',
            display: 'block'
        }
    },
    drawer: {
        width: '400px',
        flexShrink: 0,
        '@media (max-width:1200px)': {
            width: '100%',
            maxWidth: 'unset',
            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
        }
    },
    drawerPaper: {
        top: '0px',
        maxWidth: '400px',
        position: 'relative',
        minHeight: '93vh',
        '@media (max-width:1200px)': {
            zIndex: '0',
            minHeight: 'unset',
            width: '100%',
            maxWidth: 'unset'
        }
    },
    content: {
        flexGrow: 1,
        padding: '30px',
        '@media (max-width:600px)': {
            padding: '15px'
        },
        '@media (max-width:400px)': {
            padding: '15px 0'
        }
    },
    toolbar: {
        height: '0px'
    },
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 30px 5px 30px'
    },
    categoryTitle: {
        height: '30px'
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
    }
});

const ROWS_PER_PAGE = 10;

class AdminSideBar extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        values: PropTypes.array,
        onDelete: PropTypes.func
    };

    static defaultProps = {
        values: [],
        onDelete: noop
    };

    constructor (...args) {
        super(...args);

        const { values } = this.props;

        this.state = {
            selected: [],
            page: 0,
            rowsPerPage: values.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : values.length,
            checkboxIndeterminate: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.values !== this.props.values) {
            this.setState({
                rowsPerPage: nextProps.values.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.values.length,
                selected: []
            });
        }
    }

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { valueForDelete } = this.state;

        this.props.onDelete([valueForDelete.id])
            .then(() => {
                this.setState({
                    valueForDelete: null
                });
            });
    };

    render () {
        const { classes } = this.props;
        const { valueForDelete } = this.state;

        return (
            <Paper className={classes.paper}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.toolbarNav}>
                        <Typography variant='h6' className={classes.categoryTitle}>Категории услуг</Typography>
                        <Tooltip title='Добавление'>
                            <IconButton aria-label='Add'>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider/>
                    <div className={classes.toolbar}/>
                    {/* values list or table */}
                </Drawer>
                <Modal className={classes.modal} disableEnforceFocus open={false}>
                    <Paper className={classes.modalContent}>
                        {/* add new value form */}
                    </Paper>
                </Modal>
                <Dialog
                    open={!!valueForDelete}
                    onClose={this.handleWarningDisagree}
                >
                    <DialogTitle>Вы точно хотите удалить категорию услуги?</DialogTitle>
                    <DialogContent className={classes.warningContent}>
                        <DialogContentText>{valueForDelete && valueForDelete.name}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleWarningDisagree} color='primary'>
                                Нет
                        </Button>
                        <Button onClick={this.handleWarningAgree} color='primary' autoFocus>
                                Да
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        );
    }
}

export default withStyles(materialStyles)(AdminSideBar);
