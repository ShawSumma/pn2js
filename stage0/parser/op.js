const token = require('./token.js');
const node = require('./node.js');
const prec = require('./prec.js');

const isLevel = function(level, curToken) {
    return curToken[0] === token.operator && prec[level].includes(curToken[1]);
};

const opLevel = function(level, stream) {
    if (level === prec.length) {
        if (stream.length !== 1) {
            throw new Error("internal parser error in prec parse");
        }
        return stream[0];
    }
    let args = [];
    let arg = [];
    for (let curToken of stream) {
        if (isLevel(level, curToken)) {
            args.push(opLevel(level + 1, arg), curToken[1]);
            arg = [];
        } else {
            arg.push(curToken);
        }
    }
    if (arg.length !== 0) {
        args.push(opLevel(level + 1, arg));
    }
    if (prec[level].includes('->')) {
        let ret = args[args.length - 1];
        for (let i = args.length - 3; i >= 0; i -= 2) {
            ret = [node.oper, args[i + 1], args[i], ret];
        }
        return ret;
    } else {
        let ret = args[0];
        for (let i = 1; i < args.length; i += 2) {
            ret = [node.oper, args[i], ret, args[i + 1]];
        }
        return ret;
    }
};

module.exports = function(stream) {
    return opLevel(0, stream);
}