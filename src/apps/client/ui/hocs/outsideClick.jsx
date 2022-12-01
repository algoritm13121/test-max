import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

const outsideClick = WrappedComponent => {
    class OutsideClick extends PureComponent {
        state = {
            outsideClickEnabled: false
        };

        componentWillUnmount () {
            document.addEventListener('mousedown', this.clickFn);
            document.addEventListener('touchstart', this.clickFn);
            document.addEventListener('focus', this.focusFn, true);
        }

        turnOnClickOutside = (component, handleOutsideClick) => {
            this.setState({
                outsideClickEnabled: true
            });

            this.clickFn = ((localNode, eventHandler) => event => {
                let source = event.target;
                let found = false;
                this.handleClick();

                while (source.parentNode) {
                    found = source === localNode;

                    if (found) {
                        return;
                    }
                    source = source.parentNode;
                }

                eventHandler.call(component, event);
            })(ReactDOM.findDOMNode(component), handleOutsideClick);
            /**
             * IE11 11.0.47 calls FocusEvent handlers with useCapture both
             * for the original target and body
             */
            this.focusFn = function focusFn (event) { // eslint-disable-line func-style
                if (event.target === document.body) {
                    return;
                }
                // eslint-disable-next-line no-unused-expressions
                typeof this.clickFn === 'function' ? this.clickFn(event) : '';
            };

            document.addEventListener('mousedown', this.clickFn);
            document.addEventListener('touchstart', this.clickFn);
            document.addEventListener('focus', this.focusFn, true);
        };

        handleClick = () => {
            document.removeEventListener('mousedown', this.clickFn);
            document.removeEventListener('touchstart', this.clickFn);
            document.removeEventListener('focus', this.focusFn, true);

            this.setState({
                outsideClickEnabled: false
            });
        };

        render () {
            return <WrappedComponent
                {...this.props}

                outsideClickEnabled={this.state.outsideClickEnabled}

                turnOnClickOutside={this.turnOnClickOutside}
            />;
        }
    }

    return OutsideClick;
};

export default outsideClick;
