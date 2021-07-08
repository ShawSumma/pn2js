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
};module.exports = (async function(){return(await pn.cons($Enum,[`block`,`call`,`array`,`oper`,`local`,`value`,`array`]));})();