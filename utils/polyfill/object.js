if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        value: require('babel-runtime/core-js/object/assign').default, // eslint-disable-line global-require
        configurable: true,
        enumerable: false,
        writable: true
    });
}
