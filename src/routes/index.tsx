import { Link, createFileRoute } from '@tanstack/react-router'
import { IconBrandGithub } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import {
  assessments,
  isExternalAssessmentDestination,
} from '@/data/assessments'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main
      className={cn(
        'min-h-screen',
        'bg-[linear-gradient(to_right,var(--sidebar)_1px,transparent_1px),linear-gradient(to_bottom,var(--sidebar)_1px,transparent_1px)] bg-size-[1rem_1rem]',
      )}
    >
      <MotionContainer className="container mx-auto space-y-12 p-4 py-16">
        <MotionItem className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Assessment</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            A collection of technical assessments and coding challenges.
          </p>
          <Button
            variant="secondary"
            render={
              <a
                href="https://github.com/anshoriacc/assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-external-link"
              />
            }
          >
            <IconBrandGithub />
            GitHub
          </Button>
        </MotionItem>

        <MotionItem className="grid gap-4 md:grid-cols-3">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="border-border/70">
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                {/*<CardDescription className="capitalize">
                  {assessment.company}
                </CardDescription>*/}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {assessment.summary}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    isExternalAssessmentDestination(assessment) ? (
                      <a
                        href={assessment.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-external-link"
                      />
                    ) : (
                      <Link to={assessment.to} />
                    )
                  }
                >
                  View assessment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </MotionItem>
      </MotionContainer>
    </main>
  )
}
