export type OperationType = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'

export function calculateResult(
  left: number,
  type: OperationType,
  right: number,
) {
  switch (type) {
    case 'ADD':
      return left + right
    case 'SUBTRACT':
      return left - right
    case 'MULTIPLY':
      return left * right
    case 'DIVIDE':
      if (right === 0) throw new Error('Cannot divide by zero')
      return left / right
    default:
      throw new Error('Invalid operation type')
  }
}
