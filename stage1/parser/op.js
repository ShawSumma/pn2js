
const println = console.log;
const quote = '"';
const newline = String.fromCharCode(10);

const List = Object.freeze({
    cons: x => Object.freeze([...x]),
    empty: Object.freeze([]),
    prepend: e => x => Object.freeze([e, ...x]),
    append: x => e => Object.freeze([...x, e]),
    concat: x => y => Object.freeze([...x, ...y]),
});

const Enum = Object.freeze({
    cons: x => {
        let ret = {};
        for (let i of x) {
            ret[i] = Symbol(i);
        }
        return Object.freeze(ret);
    },
});

const error = x => {
    throw new Error(x);
};

const pn = {
    op2add: (x, y) => {
        if (Array.isArray(x) && Array.isArray(y)) {
            return [...x, ...y]
        } else {
            return x + y
        }
    },
    op2sub: (x, y) => x - y,
    op2mul: (x, y) => x * y,
    op2div: (x, y) => x / y,
    op2lt: (x, y) => x < y,
    op2gt: (x, y) => x > y,
    op2lte: (x, y) => x <= y,
    op2gte: (x, y) => x >= y,
    op2eq: (x, y) => x === y,
    op2neq: (x, y) => x !== y,
    op2call: (x, y) => {
        if (x instanceof Function) {
            return x(y);
        } else {
            let ret = x[y];
            if (ret instanceof Function) {
                return ret.bind(x);
            } else {
                return ret;
            }
        }
    },
    cons: (cls, args) => {
        if (cls instanceof Function) {
            return cls(...args);
        } else {
            return cls.cons(args);
        }
    },
};
module.exports = (function(){let token=pn.op2call(require, `./token.js`);let node=pn.op2call(require, `./node.js`);let prec=pn.op2call(require, `./prec.js`);let is_level=((level)=>((cur)=>(pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `operator`))&&pn.op2call(pn.op2call(pn.op2call(prec, level), `includes`), pn.op2call(cur, 1)))));let bind_back=((args)=>(function(){let more=((ret)=>((i)=>(pn.op2lt(i,0)?ret:(function(){let next=pn.cons(List, [pn.op2call(node, `oper`),pn.op2call(args, pn.op2add(i,1)),pn.op2call(args, i),ret]);return pn.op2call(pn.op2call(more, next), pn.op2sub(i,2));})())));let len=pn.op2call(args, `length`);return pn.op2call(pn.op2call(more, pn.op2call(args, pn.op2sub(len,1))), pn.op2sub(len,3));})());let bind_front=((args)=>(function(){let more=((ret)=>((i)=>(pn.op2gte(i,pn.op2call(args, `length`))?ret:(function(){let next=pn.cons(List, [pn.op2call(node, `oper`),pn.op2call(args, i),ret,pn.op2call(args, pn.op2add(i,1))]);return pn.op2call(pn.op2call(more, next), pn.op2add(i,2));})())));return pn.op2call(pn.op2call(more, pn.op2call(args, 0)), 1);})());let op_level=((level)=>((stream)=>(pn.op2eq(level,pn.op2call(prec, `length`))?pn.op2call(stream, 0):(function(){let more=((args)=>((arg)=>((index)=>(function(){let cur=pn.op2call(stream, index);return (pn.op2eq(cur,undefined)?(function(){let args_res=(pn.op2neq(pn.op2call(arg, `length`),0)?(function(){let res=pn.op2call(pn.op2call(op_level, pn.op2add(level,1)), arg);return pn.op2call(pn.op2call(pn.op2call(List, `append`), args), res);})():args);return (pn.op2call(pn.op2call(pn.op2call(prec, level), `includes`), `->`)?pn.op2call(bind_back, args_res):pn.op2call(bind_front, args_res));})():pn.op2call(pn.op2call(is_level, level), cur)?(function(){let res=pn.op2call(pn.op2call(op_level, pn.op2add(level,1)), arg);let args1=pn.op2call(pn.op2call(pn.op2call(List, `append`), args), res);let args2=pn.op2call(pn.op2call(pn.op2call(List, `append`), args), pn.op2call(cur, 1));return pn.op2call(pn.op2call(pn.op2call(more, args2), pn.op2call(List, `empty`)), pn.op2add(index,1));})():pn.op2call(pn.op2call(pn.op2call(more, args), pn.op2call(pn.op2call(pn.op2call(List, `append`), arg), cur)), pn.op2add(index,1)));})())));return pn.op2call(pn.op2call(pn.op2call(more, pn.op2call(List, `empty`)), pn.op2call(List, `empty`)), 0);})())));return ((stream)=>pn.op2call(pn.op2call(op_level, 0), stream));})();