import { createFileRoute } from '@tanstack/react-router'
import { IconCheckbox } from '@tabler/icons-react'

import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { QuickFormStyling } from './-components/quick-form-styling'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/ellty/quick-form-styling')({
  component: QuickFormStylingPage,
  head: () => ({
    meta: [
      {
        title: 'Quick Form Styling',
      },
      {
        name: 'description',
        content:
          'Interactive demonstration of form element styling states including checkboxes, radio buttons, and inputs with hover and active states.',
      },
    ],
  }),
})

function QuickFormStylingPage() {
  return (
    <MotionContainer
      as="main"
      className="mx-auto min-h-dvh w-full max-w-3xl space-y-12 p-4 pt-16 sm:p-6 sm:pt-16"
    >
      <MotionItem className="flex flex-col space-y-6">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="w-fit gap-1.5 rounded-full px-3 py-1"
          >
            <IconCheckbox className="size-3.5" />
            Ellty
          </Badge>

          <div className="space-y-2">
            <h1 className="font-medium sm:text-lg">
              Quick Form Styling
            </h1>

            <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base">
              Interactive demonstration of form element styling states across
              checkboxes, radio buttons, and inputs.
            </p>
          </div>
        </div>

        <QuickFormStyling />

        <div className="flex flex-col space-y-4">
          <h2 className="font-medium">Explanation</h2>

          <div className="text-muted-foreground space-y-4">
            <div className="space-y-2">
              <h4 className="text-foreground">Checkbox</h4>
              <ul className="space-y-2">
                <li>
                  State 1: not-checked default - border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#CDCDCD] opacity-60" />
                  #CDCDCD 60%, check: none
                </li>
                <li>
                  State 2 & 8: not-checked & hover - border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#BDBDBD]" />
                  #BDBDBD 100%, check:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#E3E3E3]" />
                  #E3E3E3
                </li>
                <li>
                  State 3: not-checked & active - border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#BDBDBD]" />
                  #BDBDBD, outline:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6] opacity-10" />
                  #2469F6 3px, check: #878787
                </li>
                <li>
                  State 5: checked default - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6]" />
                  #2469F6, border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6]" />
                  #2469F6, check:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
                <li>
                  State 4 & 6: checked & hover - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#5087F8]" />
                  #5087F8, border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#5087F8]" />
                  #5087F8, check:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
                <li>
                  State 7: checked & active - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6]" />
                  #2469F6, border:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6]" />
                  #2469F6, outline:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#2469F6] opacity-10" />
                  #2469F6 3px 10%, check:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-foreground">Button</h4>
              <ul className="space-y-2">
                <li>
                  State 1: default - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFCE22]" />
                  #FFCE22
                </li>
                <li>
                  State 2: hover - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFD84D]" />
                  #FFD84D
                </li>
                <li>
                  State 3: active - bg:{' '}
                  <span className="mr-1 inline-block size-3 rounded-xs bg-[#FFCE22]" />
                  #FFCE22
                </li>
              </ul>
            </div>
          </div>
        </div>
      </MotionItem>
    </MotionContainer>
  )
}
