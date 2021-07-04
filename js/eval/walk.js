const node = require('../parser/node.js');

const run = function(ast, locals) {
    if (ast[0] === node.block) {
        let ret = null;
        for (let i = 1; i < ast.length; i += 1) {
            ret = run(ast[i], locals);
        }
        return ret;
    }
    if (ast[0] === node.call) {
        let func = run(ast[1], locals)
        let args = [];
        for (let i = 2; i < ast.length; i += 1) {
            args.push(run(ast[i], locals));
        }
        return func(...args);
    }
    if (ast[0] === node.oper) {
        let op = ast[1];
        let lhs = run(ast[2]);
        let rhs = run(ast[3]);
        if (op === '+') {
            return lhs + rhs;
        }
        if (op === '-') {
            return lhs - rhs;
        }
        if (op === '*') {
            return lhs * rhs;
        }
        if (op === '/') {
            return lhs / rhs;
        }
        throw new Error("unknown operator " + op);
    }
    if (ast[0] === node.local) {
        return locals[local.length - 1][ast[1]];
    }
    if (ast[0] === node.nonlocal) {
        return locals[ast[1]][ast[2]];
    }
    if (ast[0] === node.value) {
        return ast[1];
    }
    throw new Error("unknown node " + String(ast[0]));
}

module.exports = function(ast) {
    run(ast, []);
};