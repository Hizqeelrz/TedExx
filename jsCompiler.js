'use strict';

// lexical tokenizer
function tokenizer(input) {

  // Regex for Validation

  let WHITESPACE = /\s/;
  let NUMBERS = /[0-9]/;
  let LETTERS = /[a-zA-Z]/i;


  // A current variable used to track the position just like cursor
  let current = 0;

  // array for pushing our tokens IN
  let tokens = [];

  // our tokens length can be unkown so we have to increment as much as possible

  while (current < input.length) {

    let char = input[current];

    // to check if we have an open parenthises

    if (char === '(') {

      tokens.push({
        type: 'paren',
        value: '(',
      });

      current++;

      // continue is for next cycle of loop
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

    // Regex is described above i.e /\s/ which shows that the whitespace if exist than continue 

    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // Numbers are captured in a sequence as it can be of any number of character

    if (NUMBERS.test(char)) {

      // value variable (String) so store/push characters into it 
      let value = '';

      // loop through each number until a character is found i.e not a number
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // push number token to tokens array

      tokens.push({ type: 'number', value });

      // And we continue on.
      continue;
    }

    // String for double quote
    if (char === '"') {

      let value = '';


      char = input[++current];

      // iterate through character until next double qoute is found
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      // add our `string` token to the `tokens` array.
      tokens.push({ type: 'string', value });

      continue;
    }

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

    // if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // At the end of our `tokenizer` we simply return the tokens array.
  return tokens;
}

// PARSER for tokens to convert it into Ast
// accepting array of tokens
function parser(tokens) {

  let current = 0;

  // using recursion instead of while loop. walk() is defined (it can any function name)

  function walk() {

    // grabbing the current token
    let token = tokens[current];

    // we check if we have number token 

    if (token.type === 'number') {

      // If we have one, we will increment current.
      current++;

      // newAst is returned i.e NumberLiteral, setting its value to our token 
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    // same like above and a StringLiteral is created
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    // if an open parenthesis is detected. CallExpression is called
    if (
      token.type === 'paren' &&
      token.value === '('
    ) {

      // open paren is skipped through our current increment, as we dont need it in our AST
      token = tokens[++current];

      // base node with type CallExpression, as we will set the name of the current token value

      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      // current is incremented, to skip the name token
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

      // We will increment `current` one last time to skip the closing
      // parenthesis.
      current++;

      // And return the node.
      return node;
    }

    // Again, if we haven't recognized the token type by now we're going to
    // throw an error.
    throw new TypeError("Unable to recognize this " + token.type);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: 'Program',
    body: [],
  };

  // this is done inside a loop bcz we can have Expression inside a nested loop
  // (divide 10 2)
  // (multiply 5 9)

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

// accepts previous ast and the visitor 
function traverser(ast, visitor) {

  // it will allow us to iterate over an Array and call the next traverseNode funtion
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  // accepts the current node and the parent node and return the value to the methods
  function traverseNode(node, parent) {

    // it will check for an exitence of a method with a visitor matching type
    let methods = visitor[node.type];

    // enter is the any type which is entered stored in the `methods`
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // Next we are going to split things up by the current node type.
    switch (node.type) {

      // program will have array of nodes and it is at the top level program
      // traverseArray will call the traverseNode in return which will create recursive call
      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      // no need for the child nodes to visit so we will break
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

  // to keep things simple, a Context property is created on our parent nodes that we will push nodes to parents context
  // In simple words, it is reference from old `ast` to `new` ast
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

        // to push arguments
        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {

          // we are wrapping CallExpression into ExpressionStatement bcz due to top level Javascript
          // CallExpresiion is Statements 
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // push our (possibly wrapped) `CallExpression` to the `parent`'s
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

    // for CallExpression we will call callee, we will map through each node and run through code generator 
    // joining with comma and then adding closing parenthesis

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
      throw new TypeError("Unable to recognize this" + node.type);
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


// Now just export everything...
module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler,
};
