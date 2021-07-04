const fs = require('fs');
const util = require('util');

const lex = require('./parser/lex.js');
const parse = require('./parser/parse.js');
const cjs = require('./compiler/cjs.js');

const main = function(args) {
    const filename = args[0];
    if (filename == null) {
        throw new Error(`expected a file on command line`);
    }
    const src = fs.readFileSync(filename).toString();
    const tokens = lex(src);
    const ast = parse(tokens);
    const js = cjs(ast);
    fs.writeFileSync('out.js', js);
};

main(process.argv.slice(2));