'use strict';

// lexical tokenizer
function tokenizer(input) {

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

    // Regex

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // Regex

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {

      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      // And we continue on.
      continue;
    }

    if (char === '"') {

      let value = '';


      char = input[++current];


      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      // And add our `string` token to the `tokens` array.
      tokens.push({ type: 'string', value });

      continue;
    }

    // Regex

    let LETTERS = /[a-zA-Z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // And pushing that value as a token with the type `name` and continuing.
      tokens.push({ type: 'name', value });

      continue;
    }

    // Finally if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return tokens;
}

// parser

function parser(tokens) {

  let current = 0;

  function walk() {

    let token = tokens[current];

    if (token.type === 'number') {

      // If we have one, we'll increment `current`.
      current++;

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (
      token.type === 'paren' &&
      token.value === '('
    ) {

      token = tokens[++current];

      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      token = tokens[++current];

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // we'll call the `walk` function which will return a `node` and we'll
        // push it into our `node.params`.
        node.params.push(walk());
        token = tokens[current];
      }

      // Finally we will increment `current` one last time to skip the closing
      // parenthesis.
      current++;

      // And return the node.
      return node;
    }

    // Again, if we haven't recognized the token type by now we're going to
    // throw an error.
    throw new TypeError(token.type);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}


function traverser(ast, visitor) {

  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {

    let methods = visitor[node.type];


    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // Next we are going to split things up by the current node type.
    switch (node.type) {

      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      // And again, if we haven't recognized the node type then we'll throw an
      // error.
      default:
        throw new TypeError(node.type);
    }

    // If there is an `exit` method for this node type we'll call it with the
    // `node` and its `parent`.
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // Finally we kickstart the traverser by calling `traverseNode` with our ast
  // with no `parent` because the top level of the AST doesn't have a parent.
  traverseNode(ast, null);
}

function transformer(ast) {

  // We'll create a `newAst` which like our previous AST will have a program
  // node.
  let newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  // We'll start by calling the traverser function with our ast and a visitor.
  traverser(ast, {

    // The first visitor method accepts any `NumberLiteral`
    NumberLiteral: {
      // We'll visit them on enter.
      enter(node, parent) {

        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    // Next we have `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // Next up, `CallExpression`.
    CallExpression: {
      enter(node, parent) {

        // We start creating a new node `CallExpression` with a nested
        // `Identifier`.
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {

          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
        // `context`.
        parent._context.push(expression);
      },
    }
  });

  return newAst;
}


function codeGenerator(node) {

  // We'll break things down by the `type` of the `node`.
  switch (node.type) {

    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');

    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';' // << (...because we like to code the *correct* way)
      );

    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    // For `Identifier` we'll just return the `node`'s name.
    case 'Identifier':
      return node.name;

    // For `NumberLiteral` we'll just return the `node`'s value.
    case 'NumberLiteral':
      return node.value;

    // For `StringLiteral` we'll add quotations around the `node`'s value.
    case 'StringLiteral':
      return '"' + node.value + '"';

    // And if we haven't recognized the node, we'll throw an error.
    default:
      throw new TypeError(node.type);
  }
}


function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  // and simply return the output!
  return output;
}


// Now I'm just exporting everything...
module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler,
};
