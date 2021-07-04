const node = require('../parser/node.js');
const token = require('../parser/token.js');

const resolveExpr = function(ast, locals) {
    if (ast[0] === node.call) {
        for (let i = 1; i < ast.length; i += 1) {
            resolveExpr(ast[i], locals);
        }
    } else if (ast[0] === node.oper) {
        for (let i = 2; i < ast.length; i += 1) {
            resolveExpr(ast[i], locals);
        }
    } else if (ast[0] == token.ident) {
        let name = ast[1];
        console.log(name, locals);
        if (name in locals[0]) {
            ast.length = 0;
            ast.push(node.value);
            ast.push(locals[0][name]);
        } else if (locals[locals.length - 1].includes(name)) {
            ast.length = 0;
            ast.push(node.locals);
            ast.push(locals[locals.length - 1].indexOf(name));
        } else {
            for (let i = locals.length - 1; i >= 0; i -= 1) {
                if (i === 0) {
                    throw new Error("name not defined " + name);
                }
                let nonlocal = locals[i].indexOf();
                if (nonlocal != -1) {
                    ast.length = 0;
                    ast.push(node.nonlocal);
                    ast.push(i);
                    ast.push(nonlocal);
                }
            }
        }
    } else if (ast[0] === token.number) {
        let val = ast[1];
        ast.length = 0;
        ast.push(node.value);
        ast.push(Number(val));
    } else {
        throw new Error("bad node " + String(ast[0]));
    }
};

const resolveBlockScope = function(ast, locals) {
    locals.push([]);
    if (ast[0] === node.block) {
        for (let i = 1; i < ast.length; i += 1) {
            resolveExpr(ast[i], locals);
        }
    } else {
        throw new Error("internal error invalid attempt to block scope");
    }
    locals.pop();
};

module.exports = function(ast) {
    return resolveBlockScope(ast, [{
        println: console.log
    }]);
};