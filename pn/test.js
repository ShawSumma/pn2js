
const println = console.log;

const List = Object.freeze({
    cons: x => Object.freeze([...x]),
    empty: Object.freeze([]),
    add: x => e => Object.freeze([...x, e]),
    concat: x => y => Object.freeze([...x, ...y]),
});

const Dict = Object.freeze({
    empty: Object.freeze({}),
    add: x => k => v => Object.freeze({...x, [k]: y}),
    concat: x => y => Object.freeze({...x, ...y}),
});

const pn = {
    op2add: (x, y) => x + y,
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
            return x[y];
        }
    },
    cons: (cls, args) => {
        return cls.cons(args);
    },
};
pn.op2call(println, 10)