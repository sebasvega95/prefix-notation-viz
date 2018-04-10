function tokenizer(input) {
  let current = 0;
  const tokens = [];
  while (current < input.length) {
    let char = input[current];

    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'number', value, position: current });
      continue;
    }

    const OPERATORS = /[+\-*/]/;
    if (OPERATORS.test(char)) {
      tokens.push({ type: 'operator', value: char, position: current });
      current++;
      continue;
    }

    throw new TypeError(
      `I don't know what this character is: ${char} at position ${current} in input`
    );
  }

  if (tokens.length === 0) {
    throw new TypeError('Empty expression');
  }
  return tokens;
}

function parser(tokens) {
  let current = 0;
  function walk() {
    const token = tokens[current];
    if (!token) {
      throw new RangeError(current);
    }

    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: +token.value
      };
    }

    if (token.type === 'operator') {
      current++;
      let left, right;
      try {
        left = walk();
      } catch (err) {
        if (err instanceof RangeError) {
          throw new SyntaxError(
            `Expected parameter for operation "${token.value}" at position ${
              token.position
            } in input`
          );
        }
        throw err;
      }
      try {
        right = walk();
      } catch (err) {
        if (err instanceof RangeError) {
          throw new SyntaxError(
            `Expected another parameter for operation ${
              token.value
            } at position ${token.position} in input`
          );
        }
        throw err;
      }
      return {
        type: 'ArithmeticExpression',
        value: token.value,
        left,
        right
      };
    }
    throw new TypeError(token.type);
  }

  const ast = walk();
  if (current < tokens.length) {
    throw new SyntaxError(
      `Invalid expression at "${tokens[current].value}" at position ${
        tokens[current].position
      } in input`
    );
  }
  return ast;
}

function traverser(ast) {
  function traverseNode(node) {
    switch (node.type) {
      case 'ArithmeticExpression': {
        const left = traverseNode(node.left);
        const right = traverseNode(node.right);
        return callOperator(node.value, left, right);
      }
      case 'NumberLiteral': {
        return node.value;
      }
      default: {
        throw new TypeError(node.type);
      }
    }
  }

  function callOperator(op, left, right) {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return Math.floor(left / right);
      default:
        throw new TypeError(op);
    }
  }

  return traverseNode(ast);
}

export function computeAst(input) {
  return parser(tokenizer(input));
}

export const computeResultFromAst = traverser;
