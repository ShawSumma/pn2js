const fs = require('fs');
const util = require('util');

const lex = require('./parser/lex.js');
const parse = require('./parser/parse.js');
const scope = require('./compiler/scope.js')
const walk = require('./eval/walk.js');

const main = function(args) {
    const filename = args[0];
    if (filename == null) {
        throw new Error(`expected a file on command line`);
    }
    const src = fs.readFileSync(filename).toString();
    const tokens = lex(src);
    const ast = parse(tokens);
    scope(ast);
    const res = util.inspect(ast, {
        depth: null,
    });
    console.log(res);
    walk(ast);
};

main(process.argv.slice(2));