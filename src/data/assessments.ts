export type Assessment = {
  id: string
  title: string
  company: string
  to: string
  summary: string
}

export type AssessmentsByCompany = {
  company: string
  items: Assessment[]
}

export const assessments: Assessment[] = [
  {
    id: 'quick-form-styling',
    title: 'Quick Form Styling',
    company: 'Ellty',
    to: '/ellty/quick-form-styling',
    summary:
      'Interactive styling states for checkboxes and buttons with detailed state explanation.',
  },
]

export function isExternalAssessmentDestination(assessment: Assessment) {
  return /^https?:\/\//i.test(assessment.to)
}

export function getAssessmentsByCompany(company: string) {
  const normalizedCompany = company.toLowerCase()

  return assessments.filter(
    (assessment) => assessment.company.toLowerCase() === normalizedCompany,
  )
}

export function getAssessmentById(id: string) {
  return assessments.find((assessment) => assessment.id === id)
}

export function getAssessmentsGroupedByCompany(): AssessmentsByCompany[] {
  const grouped = new Map<string, Assessment[]>()

  for (const assessment of assessments) {
    const companyAssessments = grouped.get(assessment.company) ?? []
    companyAssessments.push(assessment)
    grouped.set(assessment.company, companyAssessments)
  }

  return Array.from(grouped.entries()).map(([company, items]) => ({
    company,
    items,
  }))
}
