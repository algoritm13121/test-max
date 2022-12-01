
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

class FormInputList extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        list: PropTypes.array,
        disabled: PropTypes.bool,
        value: PropTypes.string.isRequired,
        handleChange: PropTypes.func.isRequired,
        lang: PropTypes.string.isRequired,
        handleCloseList: PropTypes.func.isRequired,
        styles: PropTypes.object.isRequired
    };

    static defaultProps = {
        list: null,
        disabled: false
    };

    handleCloseList = () => {
        this.props.handleCloseList();
    };

    handleChange = (name, value) => e => {
        this.props.handleChange(e, name, value);
        this.handleCloseList();
    };

    render () {
        const { name, list, disabled, value, lang, styles } = this.props;

        return (
            <ul className={styles.list}>
                {list
                    .filter(item => {
                        return !disabled || pathOr([lang, 'name'], '', item.texts) !== value;
                    })
                    .map((item, i) => {
                        const value = pathOr([lang, 'name'], '', item.texts);

                        return <li key={i} onClick={this.handleChange(name, value)}>
                            {value}
                        </li>;
                    })}
            </ul>);
    }
};

export default connect(mapStateToProps)(FormInputList);
