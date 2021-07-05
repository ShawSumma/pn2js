
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
module.exports = (function(){let token=pn.op2call(require, `./token.js`);let node=pn.op2call(require, `./node.js`);let op=pn.op2call(require, `./op.js`);let is_break_token=((cur)=>(function(){let first=pn.op2call(cur, 0);return (((((pn.op2eq(cur,pn.op2call(token, `number`))||pn.op2eq(cur,pn.op2call(token, `keyword`)))||pn.op2eq(cur,pn.op2call(token, `string`)))||pn.op2eq(cur,pn.op2call(token, `ident`)))||pn.op2eq(cur,pn.op2call(token, `open`)))||pn.op2eq(cur,pn.op2call(token, `close`)));})());let is_break_pair=((t1)=>((t2)=>(pn.op2call(is_break_token, t1)&&pn.op2call(is_break_token, t2))));let parse_call=((stream)=>(function(){let more=((args)=>((arg)=>((depth)=>((index)=>(function(){let cur=pn.op2call(stream, index);return (pn.op2eq(cur,undefined)?(function(){let next_args=(pn.op2neq(pn.op2call(arg, `length`),0)?pn.op2call(pn.op2call(pn.op2call(List, `append`), args), pn.op2call(arg, 0)):args);return (pn.op2eq(pn.op2call(args, `length`),2)?pn.op2call(next_args, 1):next_args);})():((pn.op2eq(depth,0)&&pn.op2neq(pn.op2call(arg, `length`),0))&&pn.op2call(pn.op2call(is_break_pair, pn.op2call(arg, pn.op2sub(pn.op2call(arg, `length`),1))), cur))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2call(pn.op2call(pn.op2call(List, `append`), args), pn.op2call(arg, 0))), pn.op2call(List, `empty`)), depth), index):(function(){let next=pn.op2call(pn.op2call(pn.op2call(List, `append`), arg), cur);return (pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `open`))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, args), next), pn.op2add(depth,1)), pn.op2add(index,1)):pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `close`))?(pn.op2eq(depth,0)?(function(){let inner=pn.op2call(pn.op2call(arg, `slice`), 1);let next_arg=(pn.op2eq(pn.op2call(cur, 0),`)`)?pn.op2call(parse_opers, inner):pn.op2call(parse_lines, inner));return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2call(pn.op2call(pn.op2call(List, `append`), args), next_arg)), pn.op2call(List, `empty`)), pn.op2sub(depth,1)), pn.op2add(index,1));})():pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, args), next), pn.op2sub(depth,1)), pn.op2add(index,1))):pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, args), next), depth), pn.op2add(index,1)));})());})()))));return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.cons(List, [pn.op2call(node, `call`)])), pn.op2call(List, `empty`)), 0), 0);})());let parse_opers=((stream)=>(function(){let more=((depth)=>((args)=>((expr)=>((index)=>(function(){let cur=pn.op2call(stream, index);let next=pn.op2call(pn.op2call(pn.op2call(List, `append`), expr), cur);return (pn.op2eq(cur,undefined)?(pn.op2neq(pn.op2call(expr, `length`),0)?pn.op2call(op, pn.op2call(pn.op2call(pn.op2call(List, `append`), args), pn.op2call(parse_call, expr))):pn.op2eq(pn.op2call(args, `length`),1)?pn.op2call(args, 0):pn.op2call(op, args)):(pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `operator`))&&pn.op2eq(depth,0))?(function(){let call_args=pn.op2call(parse_call, expr);let with_next=pn.op2call(pn.op2call(pn.op2call(List, `append`), args), call_args);let with_op=pn.op2call(pn.op2call(pn.op2call(List, `append`), with_next), cur);return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, depth), with_op), pn.op2call(List, `empty`)), pn.op2add(index,1));})():pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `open`))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2add(depth,1)), args), next), pn.op2add(index,1)):pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `close`))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2sub(depth,1)), args), next), pn.op2add(index,1)):pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, depth), args), next), pn.op2add(index,1)));})()))));return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, 0), pn.op2call(List, `empty`)), pn.op2call(List, `empty`)), 0);})());let parse_lines=((stream)=>(function(){let more=((nodes)=>((line)=>((depth)=>((index)=>(function(){let cur=pn.op2call(stream, index);let next=pn.op2call(pn.op2call(pn.op2call(List, `append`), line), cur);return (pn.op2eq(cur,undefined)?(function(){let elems=(pn.op2neq(pn.op2call(line, `length`),0)?(function(){let processed=pn.op2call(parse_opers, line);return pn.op2call(pn.op2call(pn.op2call(List, `append`), nodes), processed);})():nodes);return pn.op2call(pn.op2call(pn.op2call(List, `prepend`), pn.op2call(node, `block`)), elems);})():pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `open`))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, noees), next), pn.op2add(depth,1)), pn.op2add(index,1)):pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `close`))?pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, nodes), next), pn.op2sub(depth,1)), pn.op2add(index,1)):((pn.op2eq(depth,0)&&pn.op2eq(pn.op2call(cur, 0),pn.op2call(token, `newline`)))&&pn.op2neq(pn.op2call(line, `length`),0))?(function(){let processed=pn.op2call(parse_opers, line);return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2call(pn.op2call(pn.op2call(List, `append`), nodes), processed)), pn.op2call(List, `empty`)), depth), pn.op2add(index,1));})():pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, nodes), next), depth), pn.op2add(index,1)));})()))));return pn.op2call(pn.op2call(pn.op2call(pn.op2call(more, pn.op2call(List, `empty`)), pn.op2call(List, `empty`)), 0), 0);})());return ((src)=>(function(){let ret=pn.op2call(parse_lines, src);pn.op2call(println, ret);return ret;})());})();