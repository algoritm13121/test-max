import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import setMediaInfo from '../../../actions/setMediaInfo';

import bp from './mediaBreakpoints';

import debounce from 'lodash.debounce';
import map from '@tinkoff/utils/object/map';
import pathOr from '@tinkoff/utils/object/pathOr';

const DEBOUNCE_DURATION = 300;

const isLandscape = () => {
    if (window.orientation) {
        return { matches: Math.abs(window.orientation) === 90 };
    }

    return { matches: pathOr(['screen', 'orientation', 'type'], '', window)[0] === 'landscape' };
};

const mapDispatchToProps = (dispatch) => ({
    setMediaInfo: payload => dispatch(setMediaInfo(payload))
});

const media = WrappedComponent => {
    class Media extends PureComponent {
        static propTypes = {
            setMediaInfo: PropTypes.func.isRequired
        };

        constructor (...args) {
            super(...args);

            if (typeof window !== 'undefined') {
                this.updateMediaInfo();
            }
            this.updateMediaInfoDebounced = debounce(() => this.props.setMediaInfo(this.getMediaInfo()), DEBOUNCE_DURATION);
        }

        componentDidMount () {
            if (typeof window === 'undefined') {
                return;
            }

            this.updateMediaInfo();

            window.addEventListener('resize', this.updateMediaInfoDebounced);
        }

        componentWillUnmount () {
            window.removeEventListener('resize', this.updateMediaInfoDebounced);
        }

        updateMediaInfo = () => this.props.setMediaInfo(this.getMediaInfo());

        getMediaInfo = () => ({
            ...map(value => {
                const query = window.matchMedia(value);

                return query.matches;
            }, bp),
            landscape: isLandscape().matches,
            width: window.innerWidth,
            height: window.innerHeight
        });

        render () {
            return <WrappedComponent
                {...this.props}
            />;
        }
    }

    return connect(undefined, mapDispatchToProps)(Media);
};

export default media;
