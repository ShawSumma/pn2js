
const println = async (val) => {
    console.dir(val, {depth: Infinity});
};
const quote = '"';
const newline = String.fromCharCode(10);
const tick = String.fromCharCode(96);

const List = Object.freeze({
    cons: async(x) => Object.freeze([...x]),
    empty: Object.freeze([]),
    prepend: async(e) => async (x) => Object.freeze([e, ...x]),
    append: async (x) => async (e) => Object.freeze([...x, e]),
    concat: async (x) => async (y) => Object.freeze([...x, ...y]),
});

const Enum = Object.freeze({
    cons: async (x) => {
        let ret = {};
        for (let i of x) {
            ret[i] = Symbol(i);
        }
        return Object.freeze(ret);
    },
});

const error = async (x) => {
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
            let ret = x(y);
            if (ret instanceof Promise) {
                return await ret;
            } else {
                return ret;
            }
        } else {
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
            let ret = cls(...args);
            if (ret instanceof Promise) {
                return await ret;
            } else {
                return await ret;
            }
        } else {
            return await cls.cons(args);
        }
    },
};
module.exports = (async function(){return(await (async function(){let n=2;let x=(await (async function(){;return await pn.op2eq(n,1);})()?await (async function(){;return 0;})():await (async function(){;return await pn.op2eq(x,2);})()?await (async function(){;return 1;})():await (async function(){;return 2;})());return await pn.op2call(println,x);})());})();