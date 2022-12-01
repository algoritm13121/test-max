export default (() => {
    let env;

    if (typeof window !== 'undefined') {
        env = window;
    } else if (typeof global !== 'undefined') {
        env = global;
    }

    return env;
})();
