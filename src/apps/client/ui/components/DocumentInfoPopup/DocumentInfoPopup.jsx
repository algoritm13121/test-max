import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { DOC_NAMES } from '../../../../../../server/constants/constants';

import uploadDoc from '../../../services/client/uploadDoc';
import removeDoc from '../../../services/client/removeDoc';
import removeOtherDoc from '../../../services/client/removeOtherDoc';

import propOr from '@tinkoff/utils/object/propOr';
import prop from '@tinkoff/utils/object/prop';

import styles from './DocumentInfoPopup.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        user: data.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    uploadDoc: (...payload) => dispatch(uploadDoc(...payload)),
    removeDoc: (...payload) => dispatch(removeDoc(...payload)),
    removeOtherDoc: (...payload) => dispatch(removeOtherDoc(...payload))
});

class DocumentInfoPopup extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        uploadDoc: PropTypes.func.isRequired,
        removeDoc: PropTypes.func.isRequired,
        removeOtherDoc: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    static defaultProps = {
        user: {}
    };

    constructor (...args) {
        super(...args);

        const { langMap } = this.props;
        const text = propOr('accountInfo', {}, langMap).documents;

        this.docs = [
            {
                id: DOC_NAMES[0],
                label: text.personality,
                img: '/src/apps/client/ui/components/DocumentInfoPopup/images/1.png'

            },
            {
                id: DOC_NAMES[1],
                label: text.address,
                img: '/src/apps/client/ui/components/DocumentInfoPopup/images/2.png'
            },
            {
                id: DOC_NAMES[2],
                label: text.creditFrontSide,
                img: '/src/apps/client/ui/components/DocumentInfoPopup/images/3.png'
            },
            {
                id: DOC_NAMES[3],
                label: text.creditBackSide,
                img: '/src/apps/client/ui/components/DocumentInfoPopup/images/3.png'
            },
            {
                id: DOC_NAMES[4],
                label: text.anotherDocuments,
                img: '/src/apps/client/ui/components/DocumentInfoPopup/images/4.png'
            }
        ];
    }

    handleFileDrop = documentName => event => {
        event.stopPropagation();
        event.preventDefault();

        const file = event.dataTransfer.files[0];

        this.uploadFile(documentName, file);
    };

    handleDragOver = event => {
        event.stopPropagation();
        event.preventDefault();
    };

    handleFileUpload = documentName => event => {
        const file = event.target.files[0];

        event.target.value = '';
        this.uploadFile(documentName, file);
    };

    handleRemoveDoc = id => () => {
        this.props.removeDoc(id);
    };

    handleRemoveOtherDoc = i => event => {
        event.preventDefault();
        this.props.removeOtherDoc(i);
    };

    uploadFile = (documentName, file) => {
        const formData = new FormData();

        formData.append(file.name, file);
        formData.append('docName', documentName);

        return this.props.uploadDoc(formData);
    };

    render () {
        const { langMap, user } = this.props;
        const text = propOr('accountInfo', {}, langMap).documents;

        if (!user) {
            return null;
        }

        return <div className={styles.registrationPopupContainer}>
            <div className={styles.registrationInnerContainer}>
                {this.docs.map((doc, i) => {
                    const uploadedDoc = prop(doc.id, user.docs);

                    return <label
                        key={i}
                        className={classNames(styles.cardItemWrapper, {
                            [styles.cardItemWrapperHovered]: (!uploadedDoc || doc.id === 'others'),
                            [styles.activeItemCard]: doc.id === 'others' ? uploadedDoc && uploadedDoc.length : uploadedDoc
                        })}
                        onDrop={(!uploadedDoc || doc.id === 'others') ? this.handleFileDrop(doc.id) : undefined}
                        onDragOver={(!uploadedDoc || doc.id === 'others') ? this.handleDragOver : undefined}
                    >
                        {(!uploadedDoc || doc.id === 'others') && <input
                            onChange={this.handleFileUpload(doc.id)}
                            accept='application/pdf,application/msword,.xls,.xlsx,image/jpeg'
                            type='file'
                            className={styles.fileInput}
                        />}
                        <div className={styles.cardItem}>
                            <div className={styles.title}>{doc.label}
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M8 0.125C3.65117 0.125 0.125 3.65117 0.125 8C0.125 12.3488 3.65117 15.875 8 15.875C12.3488 15.875 15.875 12.3488 15.875 8C15.875 3.65117 12.3488 0.125 8 0.125ZM8.5625 11.7969C8.5625 11.8742 8.49922 11.9375 8.42188 11.9375H7.57812C7.50078 11.9375 7.4375 11.8742 7.4375 11.7969V7.01562C7.4375 6.93828 7.50078 6.875 7.57812 6.875H8.42188C8.49922 6.875 8.5625 6.93828 8.5625 7.01562V11.7969ZM8 5.75C7.77921 5.74549 7.56897 5.65462 7.41442 5.49687C7.25986 5.33913 7.1733 5.12709 7.1733 4.90625C7.1733 4.68541 7.25986 4.47337 7.41442 4.31563C7.56897 4.15788 7.77921 4.06701 8 4.0625C8.22079 4.06701 8.43102 4.15788 8.58558 4.31563C8.74014 4.47337 8.8267 4.68541 8.8267 4.90625C8.8267 5.12709 8.74014 5.33913 8.58558 5.49687C8.43102 5.65462 8.22079 5.74549 8 5.75Z" fill="#A6B1DC" fillOpacity="0.5" />
                                </svg>
                            </div>
                            <img
                                className={styles.documentIcon}
                                src={(doc.id === 'others'
                                    ? uploadedDoc && uploadedDoc.length : uploadedDoc)
                                    ? '/src/apps/client/ui/components/DocumentInfoPopup/images/ok.svg' : doc.img}
                                alt='doc image'
                            />
                            {uploadedDoc && doc.id !== 'others' && <div className={styles.bottomLabel}>
                                {uploadedDoc.name}
                                {/* eslint-disable-next-line max-len */}
                                {<svg className={styles.docRemove} onClick={this.handleRemoveDoc(doc.id)} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M9.5 1.2875L8.7125 0.5L5 4.2125L1.2875 0.5L0.5 1.2875L4.2125 5L0.5 8.7125L1.2875 9.5L5 5.7875L8.7125 9.5L9.5 8.7125L5.7875 5L9.5 1.2875Z" fill="#F8F8F8" fillOpacity="0.75" />
                                </svg>}
                            </div>}
                            {uploadedDoc && doc.id === 'others' && <div className={styles.bottomLabel}>
                                {uploadedDoc.map((uploadedDocOther, i) => {
                                    return <div key={i}>
                                        {uploadedDocOther.name}
                                        {/* eslint-disable-next-line max-len */}
                                        <svg className={styles.docRemove} onClick={this.handleRemoveOtherDoc(i)} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {/* eslint-disable-next-line max-len */}
                                            <path d="M9.5 1.2875L8.7125 0.5L5 4.2125L1.2875 0.5L0.5 1.2875L4.2125 5L0.5 8.7125L1.2875 9.5L5 5.7875L8.7125 9.5L9.5 8.7125L5.7875 5L9.5 1.2875Z" fill="#F8F8F8" fillOpacity="0.75" />
                                        </svg>
                                    </div>;
                                })}
                            </div>}
                            {!uploadedDoc && <div className={styles.bottomLabel}>{text.clickOrDrag}</div>}
                        </div>
                    </label>;
                })}
                <div className={styles.buttonContainer}>
                    <button className={classNames(styles.button)}>{text.loadButton}</button>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInfoPopup);
