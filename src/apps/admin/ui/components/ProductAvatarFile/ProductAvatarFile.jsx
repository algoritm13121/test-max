import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const SLIDE_WIDTH = 232;
const SLIDE_HEIGHT = 248;

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing.unit
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px'
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
    fileImage: {
        marginTop: '20px'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    }
});

class ProductAvatarFile extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onAvatarFileUpload: PropTypes.func.isRequired,
        initialAvatarFile: PropTypes.string
    };

    static defaultProps = {
        initialAvatarFile: ''
    };

    constructor (...args) {
        super(...args);

        this.removedFiles = [];

        this.state = {
            file: {
                path: this.props.initialAvatarFile
            }
        };

        this.handleAvatarFileChange();
    }

    handleFileUpload = (event) => {
        const file = event.target.files[0];

        this.setState({
            file: {
                content: file,
                path: URL.createObjectURL(file)
            }
        }, this.handleAvatarFileChange);

        event.target.value = '';
    };

    handleAvatarFileChange = () => {
        const { file } = this.state;

        this.props.onAvatarFileUpload(file);
    };

    handleFileLoad = event => {
        if (event.target.naturalWidth !== SLIDE_WIDTH || event.target.naturalHeight !== SLIDE_HEIGHT) {
            this.setState({
                isWrongDimensions: true
            });
        } else {
            this.setState({
                isWrongDimensions: false
            });
        }
    };

    render () {
        const { classes } = this.props;
        const { file, isWrongDimensions } = this.state;

        return <div>
            <Typography variant='h6'>Аватар</Typography>
            <div className={classes.upload}>
                <input
                    className={classes.uploadInput}
                    id='uploadAvatarInput'
                    type='file'
                    accept='image/*'
                    onChange={this.handleFileUpload}
                />
                <label htmlFor='uploadAvatarInput'>
                    <Button variant='contained' component='span' color='default'>
                        { !file.path ? 'Загрузить' : 'Загрузить другой аватар' }
                        <CloudUploadIcon className={classes.uploadIcon} />
                    </Button>
                </label>
                <div className={classes.warning}>
                    <WarningIcon className={classNames(classes.warningIcon, {
                        [classes.errorIcon]: isWrongDimensions
                    })} color={isWrongDimensions ? 'error' : 'inherit'} fontSize='small'/>
                    <Typography className={classes.warningText} color={isWrongDimensions ? 'error' : 'inherit'} variant='h6'>
                        Ширина фото дожна быть {SLIDE_WIDTH}px, а высота {SLIDE_HEIGHT}px
                    </Typography>
                </div>
            </div>
            { file.path && <img
                className={classNames(classes.fileImage, { [classes.fileImageError]: isWrongDimensions })}
                src={file.path}
                alt='avatar'
                onLoad={this.handleFileLoad}
            /> }
        </div>;
    }
}

export default withStyles(materialStyles)(ProductAvatarFile);
