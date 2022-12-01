import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';
import uploadFile from '../../../../../services/uploadFile';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import Button from '@material-ui/core/Button';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import arrayMove from '../../utils/arrayMove';

const materialStyles = theme => ({
    upload: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
        justifyContent: 'space-between',
        marginTop: theme.spacing.unit
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit,
        width: '30px',
        height: '19px',
        color: 'black'
    },
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        width: '200px',
        float: 'left',
        zIndex: '100',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
    },
    link: {
        textDecoration: 'none'
    }
});

const File = SortableHandle(({ src }) => {
    const srcArr = src.split('/');

    return <Typography>{srcArr[srcArr.length - 1]}</Typography>;
});

const FilePreview = SortableElement(({ file, i, classes, onFileDelete, isSorting }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(i)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
        <File src={file.path} type={file.type} name={file.name} fileClassName={classes.fileImage} />
    </div>);

const FilesPreviews = SortableContainer(({ files, classes, ...rest }) => {
    return (
        <div className={classes.filesList}>
            {files.map((file, i) => <FilePreview
                key={i}
                index={i}
                i={i}
                file={file}
                classes={classes}
                {...rest}
            />)}
        </div>
    );
});

const mapDispatchToProps = dispatch => ({
    uploadFile: payload => dispatch(uploadFile(payload))
});

class FormFieldDownload extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        uploadFile: PropTypes.func.isRequired,
        value: PropTypes.array,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        name: PropTypes.string
    };

    static defaultProps = {
        value: [],
        schema: {},
        name: ''
    };

    constructor (...args) {
        super(...args);

        this.state = {
            isSorting: false
        };
    }

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));

        this.setState({
            isSorting: false
        });
    };

    handleFileDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    render () {
        const { classes, value } = this.props;
        const { isSorting } = this.state;

        return <div>
            <div className={classes.upload}>
                <a className={classes.link} {...(value.length ? { href: value[0].path } : {})} download>
                    <Button variant='contained' component='span' color='default'>
                        Скачать
                        <GetAppRoundedIcon className={classes.uploadIcon} />
                    </Button>
                </a>
            </div>
            <FilesPreviews
                axis='xy'
                classes={classes}
                files={value}
                onFileDelete={this.handleFileDelete}
                onSortStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
                useDragHandle
            />
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(FormFieldDownload));
