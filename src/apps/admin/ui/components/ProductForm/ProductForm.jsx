import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import ProductFormFiles from '../ProductFormFiles/ProductFormFiles.jsx';
import ProductAvatarFile from '../ProductAvatarFile/ProductAvatarFile.jsx';

import { connect } from 'react-redux';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';
import updateProductFiles from '../../../services/updateProductFiles';
import updateProductAvatar from '../../../services/updateProductAvatar';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';

const PRODUCTS_VALUES = ['name', 'hidden'];

const materialStyles = theme => ({
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

const mapDispatchToProps = (dispatch) => ({
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload)),
    updateProductAvatar: (...payload) => dispatch(updateProductAvatar(...payload))
});

class ProductForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        updateProductFiles: PropTypes.func.isRequired,
        updateProductAvatar: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        product: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        product: {}
    };

    constructor (...args) {
        super(...args);

        const { product } = this.props;
        const newProduct = {
            hidden: false,
            ...pick(PRODUCTS_VALUES, product)
        };

        this.state = {
            product: newProduct,
            id: prop('id', product),
            initialAvatarFile: product.avatar,
            initialFiles: product.files,
            removedFiles: []
        };
    }

    getProductPayload = (
        {
            name,
            hidden,
            id
        }) => {
        return {
            name,
            hidden,
            id
        };
    };

    handleSubmit = event => {
        event.preventDefault();

        const { id, product } = this.state;
        const productPayload = this.getProductPayload(product);

        (id ? this.props.editProduct({ ...productPayload, id }) : this.props.saveProduct(productPayload))
            .then(product => {
                const { files, removedFiles } = this.state;
                const formData = new FormData();
                const oldFiles = [];

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`product-${product.id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path,
                            index: i
                        });
                    }
                });
                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));

                return this.props.updateProductFiles(formData, product.id);
            })
            .then(product => {
                const { avatar } = this.state;

                if (avatar.content) {
                    const formData = new FormData();

                    formData.append(`product-${product.id}-avatar`, avatar.content);

                    return this.props.updateProductAvatar(formData, product.id);
                }
            })
            .then(() => {
                this.props.onDone();
            });
    };

    handleChange = prop => event => {
        this.setState({
            product: {
                ...this.state.product,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = prop => (event, value) => {
        this.setState({
            product: {
                ...this.state.product,
                [prop]: value
            }
        });
    };

    handleAvatarFileUpload = avatar => {
        this.setState({
            avatar
        });
    };

    handleFilesUpload = (files, removedFiles) => {
        this.setState({
            files,
            removedFiles
        });
    };

    render () {
        const { classes } = this.props;
        const { product, id, initialFiles, initialAvatarFile } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>{id ? 'Редактирование товара' : 'Добавление нового товара'}</Typography>
            <TextField
                label='Название'
                value={product.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
                required
            />
            <Divider className={classes.divider}/>
            <ProductAvatarFile onAvatarFileUpload={this.handleAvatarFileUpload} initialAvatarFile={initialAvatarFile}/>
            <Divider className={classes.divider}/>
            <ProductFormFiles onFilesUpload={this.handleFilesUpload} initialFiles={initialFiles}/>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.hidden}
                            onChange={this.handleCheckboxChange('hidden')}
                            color='primary'
                        />
                    }
                    label='Скрыть товар'
                />
            </div>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(ProductForm));
