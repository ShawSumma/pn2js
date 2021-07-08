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
};module.exports = (async function(){return(await (async function(){let $token=await pn.op2call($import,`./token.js`);let $node=await pn.op2call($import,`./node.js`);let $prec=await pn.op2call($import,`./prec.js`);let $is_level=(async($level)=>(async($cur)=>(await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`operator`))&&await pn.op2call(await pn.op2call(await pn.op2call($prec,$level),`includes`),await pn.op2call($cur,1)))));let $bind_back=(async($args)=>await (async function(){let $more=(async($ret)=>(async($i)=>(await pn.op2lt($i,0)?$ret:await (async function(){let $next=await pn.cons($List,[await pn.op2call($node,`oper`),await pn.op2call($args,await pn.op2add($i,1)),await pn.op2call($args,$i),$ret]);return await pn.op2call(await pn.op2call($more,$next),await pn.op2sub($i,2));})())));let $len=await pn.op2call($args,`length`);return await pn.op2call(await pn.op2call($more,await pn.op2call($args,await pn.op2sub($len,1))),await pn.op2sub($len,3));})());let $bind_front=(async($args)=>await (async function(){let $more=(async($ret)=>(async($i)=>(await pn.op2gte($i,await pn.op2call($args,`length`))?$ret:await (async function(){let $next=await pn.cons($List,[await pn.op2call($node,`oper`),await pn.op2call($args,$i),$ret,await pn.op2call($args,await pn.op2add($i,1))]);return await pn.op2call(await pn.op2call($more,$next),await pn.op2add($i,2));})())));return await pn.op2call(await pn.op2call($more,await pn.op2call($args,0)),1);})());let $op_level=(async($level)=>(async($stream)=>(await pn.op2eq($level,await pn.op2call($prec,`length`))?await pn.op2call($stream,0):await (async function(){let $more=(async($args)=>(async($arg)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($stream,`length`))?await (async function(){let $args_res=(await pn.op2neq(await pn.op2call($arg,`length`),0)?await (async function(){let $res=await pn.op2call(await pn.op2call($op_level,await pn.op2add($level,1)),$arg);return await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),$res);})():$args);return (await pn.op2call(await pn.op2call(await pn.op2call($prec,$level),`includes`),`->`)?await pn.op2call($bind_back,$args_res):await pn.op2call($bind_front,$args_res));})():await (async function(){let $cur=await pn.op2call($stream,$index);return (await pn.op2call(await pn.op2call($is_level,$level),$cur)?await (async function(){let $res=await pn.op2call(await pn.op2call($op_level,await pn.op2add($level,1)),$arg);let $args1=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args),$res);let $args2=await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$args1),await pn.op2call($cur,1));return await pn.op2call(await pn.op2call(await pn.op2call($more,$args2),await pn.op2call($List,`empty`)),await pn.op2add($index,1));})():await pn.op2call(await pn.op2call(await pn.op2call($more,$args),await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$arg),$cur)),await pn.op2add($index,1)));})()))));return await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call($List,`empty`)),await pn.op2call($List,`empty`)),0);})())));return (async($stream)=>await (async function(){let $ret=await pn.op2call(await pn.op2call($op_level,0),$stream);return $ret;})());})());})();