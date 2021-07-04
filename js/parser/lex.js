const types = require("./token.js");

let ops = "+-*/%=><:";

let keywords = require('./keyword.js');

const states = {
    ready: Symbol("ready"),
    ident: Symbol("ident"),
    number: Symbol("number"),
    operator: Symbol("operator"),
    string: Symbol("string"),
};

module.exports = function(src) {
    let state = states.ready;
    let token;
    let tokens = [];
    for (let char of src) {
        if (state === states.ready) {
            if ('\t '.includes(char)) {
                state = states.ready;
            } else if ('\n\r'.includes(char)) {
                tokens.push([types.newline]);
                state = states.ready;
            } else if ('({['.includes(char)) {
                tokens.push([types.open, char]);
                state = states.ready;
            } else if (')}]'.includes(char)) {
                tokens.push([types.close, char]);
                state = states.ready;
            } else if ('0' <= char && char <= '9') {
                token = char;
                state = states.number;
            } else if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z')) {
                token = char;
                state = states.ident;
            } else if (char === '"') {
                token = '';
                state = states.string;
            } else if (ops.includes(char)) {
                token = char;
                state = states.operator;
            } else {}
        } else if (state === states.ident) {
            if ('\t '.includes(char)) {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                state = states.ready;
            } else if ('\n\r'.includes(char)) {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                tokens.push([types.newline]);
                state = states.ready;
            } else if ('({['.includes(char)) {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                tokens.push([types.open, char]);
                state = states.ready;
            } else if (')}]'.includes(char)) {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                tokens.push([types.close, char]);
                state = states.ready;
            } else if ('0' <= char && char <= '9') {
                token += char;
                state = states.ident;
            } else if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z')) {
                token += char;
                state = states.ident;
            } else if (char === '"') {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                token = '';
                state = states.string;
            } else if (ops.includes(char)) {
                if (keywords.includes(token)) {
                    tokens.push([types.keyword, token]);
                } else {
                    tokens.push([types.ident, token]);
                }
                token = char;
                state = states.operator;
            } else {
                throw new Error("invalid char in ident");
            }
        } else if (state === states.number) {
            if ('\t '.includes(char)) {
                tokens.push([types.number, token]);
                state = states.ready;
            } else if ('\n\r'.includes(char)) {
                tokens.push([types.number, token]);
                tokens.push([types.newline]);
                state = states.ready;
            } else if ('({['.includes(char)) {
                tokens.push([types.number, token]);
                tokens.push([types.open, char]);
                state = states.ready;
            } else if (')}]'.includes(char)) {
                tokens.push([types.number, token]);
                tokens.push([types.close, char]);
                state = states.ready;
            } else if ('0' <= char && char <= '9') {
                token += char;
                state = states.number;
            } else if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z')) {
                throw new Error("letter found in number");
            } else if (char === '"') {
                tokens.push([types.number, token]);
                token = '';
                state = states.string;
            } else if (ops.includes(char)) {
                tokens.push([types.number, token]);
                token = char;
                state = states.operator;
            } else {
                throw new Error("letter found in number");
            }
        } else if (state === states.operator) {
            if ('\t '.includes(char)) {
                tokens.push([types.operator, token]);
                state = states.ready;
            } else if ('\n\r'.includes(char)) {
                tokens.push([types.operator, token]);
                tokens.push([types.newline]);
                state = states.ready;
            } else if ('({['.includes(char)) {
                tokens.push([types.operator, token]);
                tokens.push([types.open, char]);
                state = states.ready;
            } else if (')}]'.includes(char)) {
                tokens.push([types.operator, token]);
                tokens.push([types.close, char]);
                state = states.ready;
            } else if ('0' <= char && char <= '9') {
                tokens.push([types.operator, token]);
                token = char;
                state = states.number;
            } else if (('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z')) {
                tokens.push([types.operator, token]);
                token = char;
                state = states.ident;
            } else if (char === '"') {
                tokens.push([types.operator, token]);
                token = '';
                state = states.string;
            } else if (ops.includes(char)) {
                token += char;
                state = states.operator;
            } else {
                throw new Error("bad char found after operator " + char);
            }
        } else if (state === states.string) {
            if (char === '"') {
                tokens.push([types.string, token]);
                state = states.ready;
            } else {
                token += char;
            }
        }
    }
    if (state === states.ident) {
        tokens.push([types.ident, token]);
    } else if (state === states.number) {
        tokens.push([types.number, token]);
    } else if (state === states.operator) {
        tokens.push([types.operator, token]);
    } else if (state === states.string) {
        tokens.push([types.string, token]);
    }
    return tokens;
};