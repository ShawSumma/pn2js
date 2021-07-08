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
};module.exports = (async function(){return(await (async function(){let $node=await pn.op2call($import,`../parser/node.js`);let $token=await pn.op2call($import,`../parser/token.js`);let $prelude=await pn.op2call($slurp,`./prelude.js`);let $block=(async($ast)=>await (async function(){let $more=(async($ret)=>(async($i)=>await (async function(){let $sub=await pn.op2call($ast,$i);return ((await pn.op2eq(await pn.op2call($sub,0),await pn.op2call($node,`oper`))&&await pn.op2eq(await pn.op2call($sub,1),`=`))?await (async function(){let $next=await pn.op2add(await pn.op2add(await pn.op2add(`let `,await pn.op2call($compile,await pn.op2call($sub,2))),`=`),await pn.op2call($compile,await pn.op2call($sub,3)));return (await pn.op2eq(await pn.op2add($i,1),await pn.op2call($ast,`length`))?await pn.op2call($error,`must not have assign as last in block`):await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$ret),$next)),await pn.op2add($i,1)));})():await (async function(){let $next=await pn.op2call($compile,$sub);return (await pn.op2neq(await pn.op2add($i,1),await pn.op2call($ast,`length`))?await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$ret),$next)),await pn.op2add($i,1)):await pn.op2eq(await pn.op2call($ret,`length`),0)?$next:await (async function(){let $body=await pn.op2call(await pn.op2call($ret,`join`),`;`);return await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await (async function(){`,$body),`;return `),$next),`;})()`);})());})());})()));return await pn.op2call(await pn.op2call($more,await pn.op2call($List,`empty`)),1);})());let $new_cons=(async($f)=>(async($a)=>await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.cons(`,$f),`,[`),await pn.op2call(await pn.op2call($a,`join`),`,`)),`])`)));let $opcall=(async($f)=>(async($a)=>await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2call(`,$f),`,`),$a),`)`)));let $call=(async($ast)=>await (async function(){let $more=(async($ret)=>(async($i)=>(await pn.op2gte($i,await pn.op2call($ast,`length`))?$ret:await (async function(){let $cur=await pn.op2call($ast,$i);return ((await pn.op2eq(await pn.op2call($cur,0),await pn.op2call($token,`keyword`))&&await pn.op2eq(await pn.op2call($cur,1),`of`))?await (async function(){let $more=(async($n)=>(await pn.op2lt($n,await pn.op2call($ast,`length`))?await (async function(){let $first=await pn.op2call($compile,await pn.op2call($ast,$n));let $rest=await pn.op2call($more,await pn.op2add($n,1));return await pn.op2call(await pn.op2call(await pn.op2call($List,`prepend`),$first),$rest);})():await pn.op2call($List,`empty`)));let $args=await pn.op2call($more,await pn.op2add($i,1));return await pn.op2call(await pn.op2call($new_cons,$ret),$args);})():await (async function(){let $next=await pn.op2call(await pn.op2call($opcall,$ret),await pn.op2call($compile,$cur));return await pn.op2call(await pn.op2call($more,$next),await pn.op2add($i,1));})());})())));return await pn.op2call(await pn.op2call($more,await pn.op2call($compile,await pn.op2call($ast,1))),2);})());let $oper=(async($ast)=>await (async function(){let $op=await pn.op2call($ast,1);return (await pn.op2eq($op,`->`)?await (async function(){let $lhs=await pn.op2call($ast,2);let $rhs=await pn.op2call($compile,await pn.op2call($ast,3));return (await pn.op2eq(await pn.op2call($lhs,0),await pn.op2call($node,`call`))?await (async function(){let $more=(async($ret)=>(async($i)=>(await pn.op2lt($i,await pn.op2call($lhs,`length`))?$ret:await pn.op2add(await pn.op2add(await pn.op2add($ret,`async($`),await pn.op2call(await pn.op2call($lhs,$i),1)),`)=>`))));return await pn.op2add(await pn.op2add(await pn.op2add(`(`,await pn.op2call(await pn.op2call($more,``),1)),await pn.op2call($compile,await pn.op2call($ast,await pn.op2sub(await pn.op2call($ast,`length`),1)))),`)`);})():await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`(async($`,await pn.op2call($lhs,1)),`)=>`),$rhs),`)`));})():await (async function(){let $lhs=await pn.op2call($compile,await pn.op2call($ast,2));let $rhs=await pn.op2call($compile,await pn.op2call($ast,3));return (await pn.op2eq($op,`||`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`(`,$lhs),`||`),$rhs),`)`):await pn.op2eq($op,`&&`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`(`,$lhs),`&&`),$rhs),`)`):await pn.op2eq($op,`+`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2add(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`-`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2sub(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`*`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2mul(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`/`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2div(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`%`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2mod(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`<`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2lt(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`>`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2gt(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`<=`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2lte(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`>=`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2gte(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`==`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2eq(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`!=`)?await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add(`await pn.op2neq(`,$lhs),`,`),$rhs),`)`):await pn.op2eq($op,`.`)?await pn.op2call(await pn.op2call($opcall,$rhs),$lhs):await pn.op2call($error,await pn.op2add(`unknown op `,$op)));})());})());let $compile=(async($ast)=>(await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($node,`block`))?(await pn.op2eq(await pn.op2call($ast,`length`),1)?`null`:await pn.op2call($block,$ast)):await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($node,`call`))?(await pn.op2neq(await pn.op2call(await pn.op2call($ast,1),0),await pn.op2call($token,`keyword`))?await pn.op2call($call,$ast):await pn.op2eq(await pn.op2call(await pn.op2call($ast,1),1),`if`)?await (async function(){let $more=(async($conds)=>(async($iftrues)=>(async($iffalse)=>(async($index)=>(await pn.op2gte($index,await pn.op2call($ast,`length`))?await (async function(){let $more2=(async($ret)=>(async($i)=>(await pn.op2gte($i,await pn.op2call($conds,`length`))?await pn.op2add($ret,$iffalse):await (async function(){let $next=await pn.op2add(await pn.op2add(await pn.op2add(await pn.op2add($ret,await pn.op2call($conds,$i)),`?`),await pn.op2call($iftrues,$i)),`:`);return await pn.op2call(await pn.op2call($more2,$next),await pn.op2add($i,1));})())));return await pn.op2add(await pn.op2add(`(`,await pn.op2call(await pn.op2call($more2,``),0)),`)`);})():await pn.op2eq(await pn.op2call(await pn.op2call($ast,$index),1),`else`)?await (async function(){let $iffalse2=await pn.op2call($compile,await pn.op2call($ast,await pn.op2add($index,1)));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,$conds),$iftrues),$iffalse2),await pn.op2add($index,2));})():await pn.op2eq(await pn.op2call(await pn.op2call($ast,$index),1),`elseif`)?await (async function(){let $cond2=await pn.op2call($compile,await pn.op2call($ast,await pn.op2add($index,1)));let $iftrue2=await pn.op2call($compile,await pn.op2call($ast,await pn.op2add($index,2)));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$conds),$cond2)),await pn.op2call(await pn.op2call(await pn.op2call($List,`append`),$iftrues),$iftrue2)),$iffalse),await pn.op2add($index,3));})():await pn.op2call($error,`expected else or elseif`))))));let $cond=await pn.op2call($compile,await pn.op2call($ast,2));let $iftrue=await pn.op2call($compile,await pn.op2call($ast,3));return await pn.op2call(await pn.op2call(await pn.op2call(await pn.op2call($more,await pn.cons($List,[$cond])),await pn.cons($List,[$iftrue])),`null`),4);})():await pn.op2call($error,`keyword`)):await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($node,`oper`))?await pn.op2call($oper,$ast):await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($token,`ident`))?await pn.op2add(`$`,await pn.op2call($ast,1)):await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($token,`number`))?await pn.op2call($ast,1):await pn.op2eq(await pn.op2call($ast,0),await pn.op2call($token,`string`))?await pn.op2add(await pn.op2add($tick,await pn.op2call($ast,1)),$tick):await (async function(){await pn.op2call($println,$ast);return await pn.op2call($error,`unknwon ast`);})()));return (async($ast)=>await (async function(){let $res=await pn.op2add(await pn.op2add(await pn.op2add($prelude,`module.exports = (async function(){return(`),await pn.op2call($compile,$ast)),`);})();`);return $res;})());})());})();