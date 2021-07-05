module.exports = `
const println = console.log;
const p = console.log
const quote = '"';
const newline = String.fromCharCode(10);
const tick = String.fromCharCode(96);

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
`;