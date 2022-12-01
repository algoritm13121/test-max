import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';
import uploadFile from '../../../../../services/uploadFile';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import map from '@tinkoff/utils/array/map';
import remove from '@tinkoff/utils/array/remove';
import arrayMove from '../../utils/arrayMove';
import uniqid from 'uniqid';

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
        justifyContent: 'space-between',
        marginTop: theme.spacing.unit
    },
    title: {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        color: '#868686'
    },
    button: {
        borderRadius: '0px',
        padding: '8px 26px',
        border: '1px solid #B9A659',
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: 'transparent'
        }
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
    fileImageError: {
        outline: 'solid 4px #f44336'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px'
    },
    warningIcon: {
        color: '#ffae42',
        marginRight: '10px'
    },
    errorIcon: {
        color: '#f44336',
        marginRight: '10px'
    },
    warningText: {
        fontSize: '16px'
    },
    divider: {
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 2
    }
});

const Image = SortableHandle(({ imageClassName, src }) => (
    <img className={imageClassName} src={src} />
));

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
        <Image src={file.path} imageClassName={classes.fileImage} />
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

class FormFieldFiles extends Component {
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

    handleFilesUpload = event => {
        const newFiles = map(file => (file), event.target.files);
        const { value, schema } = this.props;
        let files = [...value, ...newFiles];

        event.target.value = '';

        if (schema.max) {
            files = files.slice(files.length - schema.max);
        }

        Promise.all(
            map(file => {
                return new Promise((resolve) => {
                    if (file.path) {
                        resolve(file);
                    }

                    const reader = new FileReader();

                    reader.fileName = file.name;
                    reader.onloadend = async () => {
                        const fileInfo = {
                            dirName: schema.dirName,
                            data: reader.result,
                            name: reader.fileName
                        };

                        return this.props.uploadFile(fileInfo)
                            .then((path) => {
                                resolve({ path, id: uniqid() });
                            });
                    };

                    reader.readAsDataURL(file);
                });
            }, files)
        )
            .then(filesArr => {
                this.props.onChange(filesArr);
            });
    };

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
        const { classes, name, value, schema } = this.props;
        const { isSorting } = this.state;
        const inputId = `${name}-${+Date.now()}`;

        return <div>
            <div className={classes.upload}>
                <input
                    className={classes.uploadInput}
                    id={inputId}
                    type='file'
                    accept={schema.accept || 'image/*'}
                    onChange={this.handleFilesUpload}
                    multiple
                />
                <label htmlFor={inputId}>
                    <Button variant='contained' component='span' color='default'>
                        Загрузить
                        <CloudUploadIcon className={classes.uploadIcon} />
                    </Button>
                </label>
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

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(FormFieldFiles));
