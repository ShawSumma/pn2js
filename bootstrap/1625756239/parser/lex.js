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
};module.exports = (async function(){return(await (async function(){let $types=await pn.op2call($import,`./token.js`);let $ops=`+-*/%=><:&|!,.`;let $keywords=await pn.op2call($import,`./keyword.js`);let $ready=(async($src)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($src,`length`))?await pn.op2call($List,`empty`):await (async function(){let $char=await pn.op2call($src,$index);return (await pn.op2eq(` `,$char)?await pn.op2call(await pn.op2call($ready,$src),await pn.op2add($index,1)):await pn.op2eq($newline,$char)?await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`newline`)]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),await pn.op2add($index,1)));})():await pn.op2call(await pn.op2call(`({[`,`includes`),$char)?await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`open`),$char]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),await pn.op2add($index,1)));})():await pn.op2call(await pn.op2call(`]})`,`includes`),$char)?await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`close`),$char]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),await pn.op2add($index,1)));})():(await pn.op2lte(`0`,$char)&&await pn.op2lte($char,`9`))?await pn.op2call(await pn.op2call(await pn.op2call($number,$src),$index),``):((await pn.op2lte(`a`,$char)&&await pn.op2lte($char,`z`))||(await pn.op2lte(`A`,$char)&&await pn.op2lte($char,`Z`)))?await pn.op2call(await pn.op2call(await pn.op2call($ident,$src),$index),``):await pn.op2eq($char,$quote)?await pn.op2call(await pn.op2call(await pn.op2call($string,$src),await pn.op2add($index,1)),``):await pn.op2call(await pn.op2call($ops,`includes`),$char)?await pn.op2call(await pn.op2call(await pn.op2call($operator,$src),$index),``):await pn.op2call($error,await pn.op2add(`ready char failed `,$char)));})())));let $ident=(async($src)=>(async($index)=>(async($token)=>await (async function(){let $char=await pn.op2call($src,$index);return (((((await pn.op2lte(`a`,$char)&&await pn.op2lte($char,`z`))||(await pn.op2lte(`A`,$char)&&await pn.op2lte($char,`Z`)))||(await pn.op2lte(`1`,$char)&&await pn.op2lte($char,`9`)))||await pn.op2eq($char,`_`))?await pn.op2call(await pn.op2call(await pn.op2call($ident,$src),await pn.op2add($index,1)),await pn.op2add($token,$char)):await (async function(){let $type=(await pn.op2call(await pn.op2call($keywords,`includes`),$token)?await pn.op2call($types,`keyword`):await pn.op2call($types,`ident`));let $ret=await pn.cons($List,[$type,$token]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),$index));})());})())));let $number=(async($src)=>(async($index)=>(async($token)=>await (async function(){let $char=await pn.op2call($src,$index);return ((await pn.op2lte(`0`,$char)&&await pn.op2lte($char,`9`))?await pn.op2call(await pn.op2call(await pn.op2call($number,$src),await pn.op2add($index,1)),await pn.op2add($token,$char)):await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`number`),$token]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),$index));})());})())));let $operator=(async($src)=>(async($index)=>(async($token)=>await (async function(){let $char=await pn.op2call($src,$index);return (await pn.op2call(await pn.op2call($ops,`includes`),$char)?await pn.op2call(await pn.op2call(await pn.op2call($operator,$src),await pn.op2add($index,1)),await pn.op2add($token,$char)):await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`operator`),$token]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),$index));})());})())));let $string=(async($src)=>(async($index)=>(async($token)=>await (async function(){let $char=await pn.op2call($src,$index);return (await pn.op2neq($char,$quote)?await pn.op2call(await pn.op2call(await pn.op2call($string,$src),await pn.op2add($index,1)),await pn.op2add($token,$char)):await (async function(){let $ret=await pn.cons($List,[await pn.op2call($types,`string`),$token]);return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$ret),await pn.op2call(await pn.op2call($ready,$src),await pn.op2add($index,1)));})());})())));return (async($src)=>await (async function(){let $ret=await pn.op2call(await pn.op2call($ready,$src),0);return $ret;})());})());})();