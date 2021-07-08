const fs = require('fs');

const $quote = '"';

const $newline = String.fromCharCode(10);
const $tick = String.fromCharCode(96);
const $args = process.argv.slice(1)

const $println = async(val) => {
    console.dir(val, { depth: Infinity });
    return null;
};
const $import = async(name) => {
    return require(name);
}
const $slurp = async(name) => {
    return String(fs.readFileSync(name));
}
const $dump = async(name) => async(data) => {
    fs.writeFileSync(name, data);
    return null;
};

const $String = Object.freeze({
    empty: "",
    from: async(v) => {
        return String(v);
    },
    cons: async(x) => {
        let ret = '';
        for (let e of x) {
            ret += await $String.from(e);
        }
        return ret;
    },
});

const $cons = async(x) => async(y) => {
    return [x, y];
};

const $car = async(p) => {
    return p[0];
};

const $cdr = async(p) => {
    return p[1];
};

const $nth = async(n) => {
    return async(a) => {
        return a[n];
    }
}

const $replace = async(s) => async(f) => async(t) => {
    return String(s).replace(f, t);
};

const $List = Object.freeze({
    empty: Object.freeze([]),
    cons: async(x) => Object.freeze([...x]),
    prepend: async(e) => async(x) => Object.freeze([e, ...x]),
    append: async(x) => async(e) => Object.freeze([...x, e]),
    concat: async(x) => async(y) => Object.freeze([...x, ...y]),
});


const $Enum = Object.freeze({
    cons: async(x) => {
        let ret = {};
        for (let i of x) {
            ret[i] = Symbol(i);
        }
        return Object.freeze(ret);
    },
});

const $error = async(x) => {
    throw new Error(x);
};

const pn = {
    op2add: async(x, y) => {
        if (Array.isArray(x) && Array.isArray(y)) {
            return [...x, ...y];
        } else {
            return x + y;
        }
    },
    op2sub: async(x, y) => x - y,
    op2mul: async(x, y) => x * y,
    op2div: async(x, y) => x / y,
    op2lt: async(x, y) => x < y,
    op2gt: async(x, y) => x > y,
    op2lte: async(x, y) => x <= y,
    op2gte: async(x, y) => x >= y,
    op2eq: async(x, y) => x === y,
    op2neq: async(x, y) => x !== y,
    op2call: async(x, y) => {
        if (x instanceof Function) {
            return await x(y);
        } else {
            // console.log(`index: ${y}`);
            let ret = x[y];
            if (ret instanceof Function) {
                return ret.bind(x);
            } else {
                return ret;
            }
        }
    },
    cons: async(cls, args) => {
        if (cls instanceof Function) {
            return await cls(...args);
        } else {
            return await cls.cons(args);
        }
    },
};module.exports = (async function(){return(await (async function(){let $token=await pn.op2call($import,`./token.js`);let $node=await pn.op2call($import,`./node.js`);let $op=await pn.op2call($import,`./op.js`);let $is_break_token=(async($atok)=>await (async function(){let $cur=await pn.op2call($atok,0);return (((((await pn.op2eq($cur,await pn.op2call($token,`number`))||await pn.op2eq($cur,await pn.op2call($token,`keyword`)))||await pn.op2eq($cur,await pn.op2call($token,`string`)))||await pn.op2eq($cur,await pn.op2call($token,`ident`)))||await pn.op2eq($cur,await pn.op2call($token,`open`)))||await pn.op2eq($cur,await pn.op2call($token,`close`)));})());let $is_break_pair=(async($t1)=>(async($t2)=>(await pn.op2call($is_break_token,$t1)&&await pn.op2call($is_break_token,$t2))));let $parse_call=(async($stream)=>await (async function(){let $more=(async($args)=>(async($arg)=>(async($depth)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($stream,`length`))?await (async function(){let $next_args=(await pn.op2neq(await pn.op2call($arg,`length`),0)?await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),await pn.op2call($arg,0)):$args);return (await pn.op2eq(await pn.op2call($next_args,`length`),2)?await pn.op2call($next_args,1):$next_args);})():((await pn.op2eq($depth,0)&&await pn.op2neq(await pn.op2call($arg,`length`),0))&&await pn.op2call(await pn.op2call($is_break_pair,await pn.op2call($arg,await pn.op2sub(await pn.op2call($arg,`length`),1))),await pn.op2call($stream,$index)))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),await pn.op2call($arg,0))),await pn.op2call($List,`empty`)),$depth),$index):await (async function(){let $cur=await pn.op2call($stream,$index);let $next=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$arg),$cur);return (await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`open`))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$args),$next),await pn.op2add($depth,1)),await pn.op2add($index,1)):await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`close`))?(await pn.op2eq($depth,1)?await (async function(){let $inner=await pn.op2call(await pn.op2call($arg,`slice`),1);let $next_arg=(await pn.op2eq(await pn.op2call($cur,0),`)`)?await pn.op2call($parse_opers,$inner):await pn.op2eq(await pn.op2call($cur,0),`]`)?await (async function(){let $ret=await pn.op2call($parse_opers,$inner);return await pn.cons($List,[await pn.op2call($node,`array`),$ret]);})():await pn.op2call($parse_lines,$inner));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),$next_arg)),await pn.op2call($List,`empty`)),await pn.op2sub($depth,1)),await pn.op2add($index,1));})():await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$args),$next),await pn.op2sub($depth,1)),await pn.op2add($index,1))):await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$args),$next),$depth),await pn.op2add($index,1)));})())))));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.cons($List,[await pn.op2call($node,`call`)])),await pn.op2call($List,`empty`)),0),0);})());let $parse_opers=(async($stream)=>await (async function(){let $more=(async($depth)=>(async($args)=>(async($expr)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($stream,`length`))?(await pn.op2neq(await pn.op2call($expr,`length`),0)?await (async function(){let $parsed_call=await pn.op2call($parse_call,$expr);let $full=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),$parsed_call);return await pn.op2call($op,$full);})():await pn.op2eq(await pn.op2call($args,`length`),1)?await pn.op2call($args,0):await pn.op2call($op,$args)):await (async function(){let $cur=await pn.op2call($stream,$index);let $next=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$expr),$cur);return ((await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`operator`))&&await pn.op2eq($depth,0))?await (async function(){let $call_args=await pn.op2call($parse_call,$expr);let $with_next=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),$call_args);let $with_op=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$with_next),$cur);return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$depth),$with_op),await pn.op2call($List,`empty`)),await pn.op2add($index,1));})():await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`open`))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2add($depth,1)),$args),$next),await pn.op2add($index,1)):await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`close`))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2sub($depth,1)),$args),$next),await pn.op2add($index,1)):await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$depth),$args),$next),await pn.op2add($index,1)));})())))));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,0),await pn.op2call($List,`empty`)),await pn.op2call($List,`empty`)),0);})());let $parse_lines=(async($stream)=>await (async function(){let $more=(async($nodes)=>(async($line)=>(async($depth)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($stream,`length`))?await (async function(){let $elems=(await pn.op2neq(await pn.op2call($line,`length`),0)?await (async function(){let $processed=await pn.op2call($parse_opers,$line);return await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$nodes),$processed);})():$nodes);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),await pn.op2call($node,`block`)),$elems);})():await (async function(){let $cur=await pn.op2call($stream,$index);let $next=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$line),$cur);return (await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`open`))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$nodes),$next),await pn.op2add($depth,1)),await pn.op2add($index,1)):await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`close`))?await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$nodes),$next),await pn.op2sub($depth,1)),await pn.op2add($index,1)):(await pn.op2eq($depth,0)&&await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`newline`)))?(await pn.op2neq(await pn.op2call($line,`length`),0)?await (async function(){let $processed=await pn.op2call($parse_opers,$line);return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$nodes),$processed)),await pn.op2call($List,`empty`)),$depth),await pn.op2add($index,1));})():await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$nodes),$line),$depth),await pn.op2add($index,1))):await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$nodes),$next),$depth),await pn.op2add($index,1)));})())))));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call($List,`empty`)),await pn.op2call($List,`empty`)),0),0);})());return (async($src)=>await (async function(){let $ret=await pn.op2call($parse_lines,$src);return $ret;})());})());})();