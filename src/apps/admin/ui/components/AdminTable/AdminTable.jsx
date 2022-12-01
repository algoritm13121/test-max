import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import AdminTableHeader from '../AdminTableHeader/AdminTableHeader.jsx';

import compose from '@tinkoff/utils/function/compose';
import difference from '@tinkoff/utils/array/difference';
import slice from '@tinkoff/utils/array/slice';
import concat from '@tinkoff/utils/array/concat';
import without from '@tinkoff/utils/array/without';
import noop from '@tinkoff/utils/function/noop';
import findIndex from '@tinkoff/utils/array/findIndex';
import any from '@tinkoff/utils/array/any';
import isUndefined from '@tinkoff/utils/is/undefined';

const materialStyles = theme => ({
    paper: {
        margin: '30px 0 0 0',
        width: '100%',
        display: 'inline-block',
        paddingRight: theme.spacing.unit,
        '@media (max-width:1200px)': {
            paddingRight: '0',
            display: 'block'
        }
    },
    table: {

        '@media (max-width:1200px)': {
        }
    },
    tableWrapper: {

    },
    tableXxx: {

    },
    valueActions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        visibility: 'hidden',
        '@media (max-width:780px)': {
            visibility: 'visible'
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
    tableCell: {
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '0px',
        fontSize: '0.8125rem',
        fontWeight: '400',
        display: 'table-cell',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'left',
        width: '438px',
        '@media (max-width:780px)': {
            width: 'auto',
            padding: '0px'
        }
    },
    tableCellActions: {
        textAlign: 'right'
    },
    tableCellHead: {
        '@media (max-width:780px)': {
            width: 'auto',
            padding: '4px 24px'
        },
        '@media (max-width:500px)': {
            width: 'auto',
            padding: '4px 12px'
        }
    },
    row: {
        backgroundColor: '#fff',
        width: '1912px',
        '&:hover $valueActions': {
            visibility: 'visible'
        }
    },
    rowVisited: {
        backgroundColor: '#cef2ec',
        width: '1912px',
        '&:hover $valueActions': {
            visibility: 'visible'
        },
        '&:hover': {
            backgroundColor: '#8ed9cd !important'
        }
    }
});

const ROWS_PER_PAGE = 10;

class AdminTable extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        headerRows: PropTypes.array,
        tableCells: PropTypes.array,
        values: PropTypes.array,
        headerText: PropTypes.string,
        deleteValueWarningTitle: PropTypes.string,
        deleteValuesWarningTitle: PropTypes.string,
        onDelete: PropTypes.func,
        onFormOpen: PropTypes.func,
        onFormClose: PropTypes.func,
        onFiltersOpen: PropTypes.func,
        filters: PropTypes.bool,
        isAddButton: PropTypes.bool,
        isClosedButton: PropTypes.bool
    };

    static defaultProps = {
        headerRows: [],
        tableCells: [],
        values: [],
        headerText: '',
        deleteValueWarningTitle: '',
        deleteValuesWarningTitle: '',
        onDelete: noop,
        onFormOpen: noop,
        onFormClose: noop,
        onFiltersOpen: noop,
        filters: false,
        isAddButton: true,
        isClosedButton: false
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

    handleSelectAllClick = event => {
        const { values } = this.props;
        const { selected, rowsPerPage, page, checkboxIndeterminate } = this.state;

        if (event.target.checked && !checkboxIndeterminate) {
            const newSelected = compose(
                concat(selected),
                without(selected),
                slice(rowsPerPage * page, rowsPerPage * (page + 1))
            )(values);

            return this.setState({
                selected: newSelected,
                checkboxIndeterminate: true
            });
        }

        const newSelected = without(
            slice(rowsPerPage * page, rowsPerPage * (page + 1), values),
            selected
        );

        this.setState({
            selected: newSelected,
            checkboxIndeterminate: false
        });
    };

    handleSelectedCloseClick = () => {
        this.setState({
            selected: [],
            checkboxIndeterminate: false
        });
    };

    handleClick = selectedValue => () => {
        const { selected } = this.state;
        const selectedIndex = findIndex(value => value.id === selectedValue.id, selected);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, selectedValue);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ selected: newSelected });

        this.setState({ selected: newSelected, checkboxIndeterminate });
    };

    handleChangePage = (event, page) => {
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ page });

        this.setState({ page, checkboxIndeterminate });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const { values } = this.props;
        const rowsPerPage = values.length > value ? value : values.length;
        const checkboxIndeterminate = this.checkCheckboxIndeterminate({ rowsPerPage });

        this.setState({ rowsPerPage, checkboxIndeterminate });
    };

    handleDelete = value => () => {
        this.setState({
            valueForDelete: value
        });
    };

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { valueForDelete } = this.state;

        (this.props.onDelete([valueForDelete.id]))
            .then(() => {
                this.setState({
                    valueForDelete: null
                });
            });
    };

    checkCheckboxIndeterminate = (
        {
            rowsPerPage = this.state.rowsPerPage,
            page = this.state.page,
            selected = this.state.selected
        } = {}
    ) => {
        const { values } = this.props;
        const visibleValues = values
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return !difference(visibleValues, selected).length;
    };

    isSelected = id => any(value => value.id === id, this.state.selected);

    render () {
        const { classes, headerRows, tableCells, values, headerText,
            deleteValueWarningTitle, deleteValuesWarningTitle, filters, isAddButton, isClosedButton } = this.props;
        const { selected, rowsPerPage, page, checkboxIndeterminate, valueForDelete } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, values.length - page * rowsPerPage);

        return (
            <Paper className={classes.paper}>
                <AdminTableHeader
                    headerText={headerText}
                    deleteValuesWarningTitle={deleteValuesWarningTitle}
                    selected={selected}
                    onDelete={this.props.onDelete}
                    onSelectedCloseClick={this.handleSelectedCloseClick}
                    onFormOpen={this.props.onFormOpen}
                    onFiltersOpen={this.props.onFiltersOpen}
                    filters={filters}
                    isAddButton={isAddButton}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby='tableTitle'>
                        <TableHead>
                            <TableRow >
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        indeterminate={checkboxIndeterminate}
                                        checked={false}
                                        onChange={this.handleSelectAllClick}
                                    />
                                </TableCell>
                                {headerRows.map(
                                    (row, i) => (
                                        <TableCell key={i} className={classes.tableCellHead}>
                                            {row.label}
                                        </TableCell>
                                    )
                                )}
                                <TableCell align='right' />
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableXxx}>
                            {values
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((value, i) => {
                                    const isSelected = this.isSelected(value.id);
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={i}
                                            selected={isSelected}
                                            className={classNames(classes.row, { [classes.rowVisited]: !isUndefined(value.visited) && !value.visited })}
                                        >
                                            <TableCell padding='checkbox' className={classes.tableCell}>
                                                <Checkbox checked={isSelected} onClick={this.handleClick(value)} />
                                            </TableCell>
                                            { tableCells.map((tableCell, i) =>
                                                <TableCell key={i} className={classes.tableCell} >{tableCell.prop(value)}</TableCell>)}
                                            <TableCell padding='checkbox' align='right' className={classNames(classes.tableCell, classes.tableCellActions)} >
                                                <div className={classes.valueActions}>
                                                    {
                                                        isClosedButton && !value.isClosed &&
                                                        <IconButton onClick={this.props.onFormClose(value)}>
                                                            <CloseRoundedIcon />
                                                        </IconButton>
                                                    }
                                                    <IconButton onClick={this.props.onFormOpen(value)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={this.handleDelete(value)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} className={classes.tableCell} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component='div'
                    count={values.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <Dialog
                    open={!!valueForDelete}
                    onClose={this.handleWarningDisagree}
                >
                    <DialogTitle>{deleteValueWarningTitle}</DialogTitle>
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

export default withStyles(materialStyles)(AdminTable);
