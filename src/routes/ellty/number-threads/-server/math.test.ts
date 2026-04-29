import { describe, expect, it } from 'vitest'

import { calculateResult } from './math'

describe('calculateResult', () => {
  it('adds numbers', () => {
    expect(calculateResult(7, 'ADD', 4)).toBe(11)
  })

  it('subtracts numbers', () => {
    expect(calculateResult(7, 'SUBTRACT', 4)).toBe(3)
  })

  it('multiplies numbers', () => {
    expect(calculateResult(7, 'MULTIPLY', 4)).toBe(28)
  })

  it('divides numbers', () => {
    expect(calculateResult(8, 'DIVIDE', 2)).toBe(4)
  })

  it('throws when dividing by zero', () => {
    expect(() => calculateResult(8, 'DIVIDE', 0)).toThrow(
      'Cannot divide by zero',
    )
  })
})
