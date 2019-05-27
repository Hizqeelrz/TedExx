const {
  tokenizer,
  compiler,
} = require('./jsCompiler');

const assert = require('assert');

var readline = require('readline-sync');

console.log("Welcome to TedEx Compiler");
console.log("--------------------------------------------- \n");

console.log("You can evaluate Arithemetic Operation: \n");
console.log("For Example: (multiply 6 (subtract 8 3))");
console.log("--------------------------------------------- \n");

var input = readline.question("Write any Valid LISP Expression to evaluate \n\n");

console.log("\n");

switch(true) {
  case input === '(add 2 (subtract 4 2))':
    console.log("Passed");
    break;
  default:
    console.log("This String is Rejected \n");
    console.log("Error is Displayed Below \n");
    break;
}

if (input == '(add 2 (subtract 4 2))') {
  var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'add'      },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'subtract' },
      { type: 'number', value: '4'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];

  }

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');

console.log('Accepted');
