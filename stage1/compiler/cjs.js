const node = require('../parser/node.js');
const token = require('../parser/token.js');
const prelude = require('./prelude.js');

const run = function(ast) {
    if (ast[0] === node.block) {
        if (ast.length === 1) {
            return 'null';
        }
        let ret = [];
        for (let i = 1; i < ast.length; i += 1) {
            let sub = ast[i];
            if (sub[0] === node.oper && sub[1] === '=') {
                ret.push(`const ${run(sub[2])}=${run(sub[3])}`);
            } else {
                ret.push(run(sub));
            }
        }
        if (ret.length === 1) {
            return ret[0];
        };
        let last = ret.pop();
        ret.push(`return ${last};\n`);
        let body = ret.join(';\n');
        return `(function(){${body}})()`;
    }
    if (ast[0] === node.call) {
        if (ast[1][0] !== token.keyword) {
            let ret = run(ast[1]);
            for (let i = 2; i < ast.length; i += 1) {
                if (ast[i][0] === token.keyword && ast[i][1] === 'of') {
                    let args = [];
                    for (let j = i + 1; j < ast.length; j += 1) {
                        args.push(run(ast[j]));
                    }
                    return `pn.cons(${ret}, [${args.join(',')}])`;
                } else {
                    ret = `pn.op2call(${ret}, ${run(ast[i])})`;
                }
            }
            return ret;
        }
        if (ast[1][1] === 'if') {
            let conds = [run(ast[2])];
            let iftrues = [run(ast[3])];
            let ifelse = 'null';
            if (ast[4] == null) {} else {
                let index = 4;
                while (ast[index] != null) {
                    if (ast[index][0] !== token.keyword) {
                        throw new Error("compiler expected keyword");
                    }
                    if (ast[index][1] === 'else') {
                        if (ast[index + 1] == null) {
                            throw new Error("compiler expected block after else");
                        }
                        if (ast[index + 2] != null) {
                            throw new Error("compiler expected nothing after else block");
                        }
                        ifelse = run(ast[index + 1]);
                        index += 2;
                    } else if (ast[index][1] === 'elseif') {
                        if (ast[index + 1] == null) {
                            throw new Error("compiler expected condition after elseif");
                        }
                        if (ast[index + 2] == null) {
                            throw new Error("compiler expected block after elseif condition");
                        }
                        conds.push(run(ast[index + 1]));
                        iftrues.push(run(ast[index + 2]));
                        index += 3;
                    } else {
                        throw new Error("compiler expected else or elseif");
                    }
                }
                let ret = '(';
                for (let i = 0; i < conds.length; i += 1) {
                    ret += conds[i];
                    ret += '?';
                    ret += iftrues[i];
                    ret += ':';
                }
                ret += ifelse;
                ret += ')';
                return ret;
            }
        }
        if (ast[1][1] === 'while') {
            let cond = run(ast[2]);
            let body = run(ast[3]);
            if (ast[4] != null) {
                throw new Error("compiler expected nothing after while loop body");
            }
            return `(function() {while (${cond}) {let ret = ${body}}; return null;})()`
        } else {
            throw new Error("cannot use keyword there");
        }
    }
    if (ast[0] === node.oper) {
        let op = ast[1];
        if (op == '->') {
            let lhs = ast[2];
            let rhs = run(ast[3]);
            if (lhs[0] === node.call) {
                let ret = '(';
                for (let i = 1; i < lhs.length; i += 1) {
                    ret += '(';
                    ret += run(lhs[i]);
                    ret += ')=>';
                }
                ret += run(ast[ast.length - 1]);
                ret += ')';
                return ret;
            } else {
                return `((${lhs[1]})=>${rhs})`;
            }
        }
        let lhs = run(ast[2]);
        let rhs = run(ast[3]);
        if (op === '+') {
            return `pn.op2add(${lhs},${rhs})`;
        }
        if (op === '-') {
            return `pn.op2sub(${lhs},${rhs})`;
        }
        if (op === '*') {
            return `pn.op2mul(${lhs},${rhs})`;
        }
        if (op === '/') {
            return `pn.op2div(${lhs},${rhs})`;
        }
        if (op === '/') {
            return `pn.op2div(${lhs},${rhs})`;
        }
        if (op === '<') {
            return `pn.op2lt(${lhs},${rhs})`;
        }
        if (op === '=') {
            return `(${lhs}=${rhs})`
        }
        throw new Error("unknown operator " + op);
    }
    if (ast[0] === token.ident) {
        return `${ast[1]}`;
    }
    if (ast[0] === token.number) {
        return `${ast[1]}`;
    }
    if (ast[0] === token.string) {
        return '`' + ast[1] + '`';
    }
    throw new Error("unknown node " + String(ast[0]));
}

module.exports = function(ast) {
    return prelude + run(ast);
};