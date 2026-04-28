import { describe, expect, it } from 'vitest'

import {
  assessments,
  isExternalAssessmentDestination,
  type Assessment,
} from '@/data/assessments'

describe('isExternalAssessmentDestination', () => {
  it('returns true when destination is a full URL', () => {
    const externalDestination: Assessment = {
      id: 'external-destination',
      title: 'External Destination',
      company: 'Example',
      to: 'https://anshori.com',
      summary: 'Example assessment.',
    }

    expect(isExternalAssessmentDestination(externalDestination)).toBe(true)
  })

  it('returns false when destination is an internal route', () => {
    const internalDestination: Assessment = {
      id: 'internal-destination',
      title: 'Internal Destination',
      company: 'Example',
      to: '/example/internal-destination',
      summary: 'Example assessment.',
    }

    expect(isExternalAssessmentDestination(internalDestination)).toBe(false)
  })
})

describe('assessments dataset', () => {
  it('supports external destinations in the to field', () => {
    const quickFormStyling = assessments.find(
      (assessment) => assessment.id === 'quick-form-styling',
    )

    expect(quickFormStyling?.to).toBe('https://anshori.com')
  })
})
