const {
  tokenizer,
  parser,
  transformer,
  codeGenerator,
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

// INPUT String MATCH POINT

switch(true) {
  case input === '(add 2 (subtract 4 2))':
    console.log("Passed");
    break;
  case input === '(add 2 (add 4 2))':
    console.log("Passed");
    break;
  case input === '(add 2 (multiply 4 2))':
    console.log("Passed");
    break;
  case input === '(add 2 (divide 4 2))':
    console.log("Passed")
    break;
  case input == '(subtract 3 (multiply 2 7))':
    console.log("Passed")
    break;
  case input == '(multiply 7 (divide 8 2))':
    console.log("Passed")
    break;
  case input == '(Multiply 9 (Add 3 2))':
    console.log("Passed")
    break;  
  // case input == '(add 2 (divide 4 2))':
  //   console.log("Accepted")
  //   break;
  // case input == '(add 2 (divide 4 2))':
  //   console.log("Accepted")
  //   break;
  // case input == '(add 2 (divide 4 2))':
  //   console.log("Accepted")
  //   break;
  // case input == '(add 2 (divide 4 2))':
  //   console.log("Accepted")
  //   break;
  // case input == '(add 2 (divide 4 2))':
  //   console.log("Accepted")
  //   break;  
  default:
    console.log("This String is Rejected \n");
    console.log("Error is Displayed Below \n");
    break;
}

// ----------------------- OUTPUT MATCH POINT ----------------------- //

switch(true) {
  case input == '(add 2 (subtract 4 2))':
    var output = 'add(2, subtract(4, 2));';
    break;
  case input == '(add 2 (add 4 2))':
    var output = 'add(2, add(4, 2));';
    break;
  case input == '(add 2 (divide 4 2))':
    var output = 'add(2, divide(4, 2));';
    break;
  case input == '(add 2 (multiply 4 2))':
    var output = 'add(2, multiply(4, 2));';
    break;
  case input == '(subtract 3 (multiply 2 7))':
    var output = 'subtract(3, multiply(2, 7));';
    break;
  case input == '(multiply 7 (divide 8 2))':
    var output = 'multiply(7, divide(8, 2));';
    break;
  case input == '(Multiply 9 (Add 3 2))':
    var output = 'Multiply(9, Add(3, 2));';
    break;  
}


// ----------------------- TOKENIZER ----------------------- //

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

  } if (input == '(add 2 (add 4 2))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'add'      },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'add' },
      { type: 'number', value: '4'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  } if (input == '(add 2 (divide 4 2))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'add'      },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'divide' },
      { type: 'number', value: '4'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  }  if (input == '(add 2 (multiply 4 2))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'add'      },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'multiply' },
      { type: 'number', value: '4'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  } if (input == '(subtract 3 (multiply 2 7))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'subtract'      },
      { type: 'number', value: '3'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'multiply' },
      { type: 'number', value: '2'        },
      { type: 'number', value: '7'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  } if (input == '(multiply 7 (divide 8 2))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'multiply'      },
      { type: 'number', value: '7'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'divide' },
      { type: 'number', value: '8'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  } if (input == '(Multiply 9 (Add 3 2))') {
    var tokens =
    [
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'Multiply'      },
      { type: 'number', value: '9'        },
      { type: 'paren',  value: '('        },
      { type: 'name',   value: 'Add' },
      { type: 'number', value: '3'        },
      { type: 'number', value: '2'        },
      { type: 'paren',  value: ')'        },
      { type: 'paren',  value: ')'        }
    ];
  }


// ----------------------- AST PARSER ----------------------- //

if (input == '(add 2 (subtract 4 2))') {
var ast = {
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
};

} if (input == '(add 2 (add 4 2))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'add',
      params: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        name: 'add',
        params: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
} if (input == '(add 2 (divide 4 2))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'add',
      params: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        name: 'divide',
        params: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
} if (input == '(add 2 (multiply 4 2))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'add',
      params: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        name: 'multiply',
        params: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
} if (input == '(subtract 3 (multiply 2 7))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '3'
      }, {
        type: 'CallExpression',
        name: 'multiply',
        params: [{
          type: 'NumberLiteral',
          value: '2'
        }, {
          type: 'NumberLiteral',
          value: '7'
        }]
      }]
    }]
  };
} if (input == '(multiply 7 (divide 8 2))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'multiply',
      params: [{
        type: 'NumberLiteral',
        value: '7'
      }, {
        type: 'CallExpression',
        name: 'divide',
        params: [{
          type: 'NumberLiteral',
          value: '8'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
} if (input == '(Multiply 9 (Add 3 2))') {
  var ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'Multiply',
      params: [{
        type: 'NumberLiteral',
        value: '9'
      }, {
        type: 'CallExpression',
        name: 'Add',
        params: [{
          type: 'NumberLiteral',
          value: '3'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
}


// ----------------------- NEW-AST PARSER TRANSFORMATION ----------------------- //

if (input == '(add 2 (subtract 4 2))') {
var newAst = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
};

} if (input == '(add 2 (add 4 2))') {
  var newAst = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
};
} if (input == '(add 2 (divide 4 2))') {
  var newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '2'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'divide'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '4'
          }, {
            type: 'NumberLiteral',
            value: '2'
          }]
        }]
      }
    }]
  };
} if (input == '(add 2 (multiply 4 2))') {
  var newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '2'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'multiply'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '4'
          }, {
            type: 'NumberLiteral',
            value: '2'
          }]
        }]
      }
    }]
  };
} if (input == '(subtract 3 (multiply 2 7))') {
  var newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '3'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'multiply'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '2'
          }, {
            type: 'NumberLiteral',
            value: '7'
          }]
        }]
      }
    }]
  };
} if (input == '(multiply 7 (divide 8 2))') {
  var newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'multiply'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '7'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'divide'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '8'
          }, {
            type: 'NumberLiteral',
            value: '2'
          }]
        }]
      }
    }]
  };
} if (input == '(Multiply 9 (Add 3 2))') {
  var newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Multiply'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '9'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'Add'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '3'
          }, {
            type: 'NumberLiteral',
            value: '2'
          }]
        }]
      }
    }]
  };
}

// ----------------------- ASSERT COMPILER CHECKING ----------------------- //

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');


console.log('Accepted');