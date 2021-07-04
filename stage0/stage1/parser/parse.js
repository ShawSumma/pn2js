const token = require('./token.js');
const node = require('./node.js');
const op = require('./op.js');

const isBreakToken = function(curToken) {
    return curToken[0] === token.number ||
        curToken[0] === token.keyword ||
        curToken[0] === token.string ||
        curToken[0] === token.ident ||
        curToken[0] === token.open ||
        curToken[0] === token.close;
};

const isBreakPair = function(token1, token2) {
    let breaks1 = isBreakToken(token1);
    let breaks2 = isBreakToken(token2);
    return breaks1 && breaks2;
};

const parseCall = function(stream) {
    let args = [node.call];
    let arg = [];
    let depth = 0;
    for (curToken of stream) {
        if (depth === 0 && arg.length !== 0) {
            let isNewArg = isBreakPair(arg[arg.length - 1], curToken);
            if (isNewArg) {
                if (arg.length !== 0) {
                    args.push(arg[0]);
                    arg = [];
                }
            }
        }
        arg.push(curToken);
        if (curToken[0] === token.open) {
            depth += 1;
        }
        if (curToken[0] === token.close) {
            depth -= 1;
            if (depth === 0) {
                arg.shift();
                arg.pop();
                if (curToken[1] === ')') {
                    args.push(parseOpers(arg));
                } else if (curToken[1] === '}') {
                    args.push(parseLines(arg));
                }
                arg = [];
            }
        }
    }
    if (arg.length !== 0) {
        args.push(arg[0]);
    }
    if (args.length === 2) {
        return args[1];
    } else {
        return args;
    }
};

const parseOpers = function(stream) {
    let depth = 0;
    let args = [];
    let expr = []
    for (curToken of stream) {
        expr.push(curToken);
        if (curToken[0] === token.operator && depth === 0) {
            let op = expr.pop();
            let next = parseCall(expr);
            args.push(next, op);
            expr = [];
        }
        if (curToken[0] === token.open) {
            depth += 1;
        }
        if (curToken[0] === token.close) {
            depth -= 1;
        }
    }
    if (expr.length !== 0) {
        args.push(parseCall(expr));
    }
    if (args.length === 1) {
        return args[0];
    } else {
        return op(args);
    }
};

const parseLines = function(stream) {
    let line = [];
    let nodes = [node.block];
    let depth = 0;
    for (let curToken of stream) {
        if (curToken[0] === token.open) {
            depth += 1;
        }
        if (depth === 0 && curToken[0] === token.newline) {
            if (line.length !== 0) {
                let node = parseOpers(line);
                nodes.push(node);
                line = [];
            }
        } else {
            line.push(curToken);
        }
        if (curToken[0] === token.close) {
            depth -= 1;
        }
    }
    if (line.length !== 0) {
        let node = parseOpers(line);
        nodes.push(node);
    }
    return nodes;
};

module.exports = parseLines;