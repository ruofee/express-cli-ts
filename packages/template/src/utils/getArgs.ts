const args: { [key: string]: string } = {};

export default () => {
    if (Object.keys(args).length) {
        return args;
    }
    const _argv = process.argv.slice(2);
    _argv.forEach(arg => {
        const _arg = arg.split('=');
        if (_arg.length >= 2) {
            args[_arg[0]] = _arg.slice(1).join('=');
        }
    });
    return args;
};
