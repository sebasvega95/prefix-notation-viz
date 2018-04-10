export function convertAst(ast) {
  function traverseNode(node) {
    switch (node.type) {
      case 'ArithmeticExpression': {
        const left = traverseNode(node.left);
        const right = traverseNode(node.right);
        return {
          name: node.value,
          children: [left, right]
        };
      }
      case 'NumberLiteral': {
        return { name: node.value };
      }
      default: {
        throw new TypeError(node.type);
      }
    }
  }

  return traverseNode(ast);
}
