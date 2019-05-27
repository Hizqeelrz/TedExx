'use strict';


function tokenizer(input) {

  // REGEX
  var WHITESPACE = /\s/;
  var NUMBERS = /[0-9]/;
  var LETTERS = /[a-zA-Z]/i;


  // This will track our position just like a cursor
  let current = 0;

  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
      });

      current++;

      continue;
    }


    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }

    // Regex is defined on top of file

    if (WHITESPACE.test(char)){
      current++;
      continue;
    }

    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];

        tokens.push({type: 'number', value});

        continue;
      }
    }

    if (char === '"') {
      let value = '';

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({type: 'string', value});

      continue;
    }

    // type is `name` token because of the sequence of letters, FOR LISP SYNTAX
    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // push the value as a token with type `name`
      tokens.push({type: 'name', value});
      continue;
    }

    throw new TypeError('What are you trying to type? Unable to read this: ' + char);

  }

  return tokens;

}

function compiler(input) {
  let tokens = tokenizer(input);
}

module.exports = {
  tokenizer,
  compiler,
};