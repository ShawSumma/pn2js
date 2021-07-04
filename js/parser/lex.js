const types = require("./token.js");

const states = {
    ready: Symbol("ready"),
    ident: Symbol("ident"),
    number: Symbol("number"),
    operator: Symbol("operator")
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
            } else if ('a' <= char && char <= 'z') {
                token = char;
                state = states.ident;
            } else if ('+-*/%'.includes(char)) {
                token = char;
                state = states.operator;
            } else {
                throw new Error("invalid char in token");
            }
        } else if (state === states.ident) {
            if ('\t '.includes(char)) {
                tokens.push([types.ident, token]);
                state = states.ready;
            } else if ('\n\r'.includes(char)) {
                tokens.push([types.ident, token]);
                tokens.push([types.newline]);
                state = states.ready;
            } else if ('({['.includes(char)) {
                tokens.push([types.ident, token]);
                tokens.push([types.open, char]);
                state = states.ready;
            } else if (')}]'.includes(char)) {
                tokens.push([types.ident, token]);
                tokens.push([types.close, char]);
                state = states.ready;
            } else if ('0' <= char && char <= '9') {
                token += char;
                state = states.ident;
            } else if ('a' <= char && char <= 'z') {
                token += char;
                state = states.ident;
            } else if ('+-/*%'.includes(char)) {
                tokens.push([types.ident, token]);
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
            } else if ('a' <= char && char <= 'z') {
                throw new Error("letter found in number");
            } else if ('+-/*%'.includes(char)) {
                tokens.push([types.number, token]);
                token = char;
                state = states.operator;
            } else {
                throw new Error("letter found in number");
            }
        } else
        if (state === states.operator) {
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
            } else if ('a' <= char && char <= 'z') {
                tokens.push([types.operator, token]);
                token = char;
                state = states.ident;
            } else if ('+-/*%'.includes(char)) {
                token += char;
                state = states.operator;
            } else {
                throw new Error("letter found after operator");
            }
        }
    }
    if (state === states.ident) {
        tokens.push([types.ident, token]);
    } else if (state === states.number) {
        tokens.push([types.number, token]);
    } else if (state === states.operator) {
        tokens.push([types.operator, token]);
    }
    return tokens;
};