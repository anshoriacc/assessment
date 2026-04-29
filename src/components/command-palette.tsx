import { useHotkey } from '@tanstack/react-hotkeys'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  IconBrandGithub,
  IconFileText,
  IconHome,
  IconMoon,
  IconSearch,
  IconSun,
} from '@tabler/icons-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  getAssessmentsGroupedByCompany,
  isExternalAssessmentDestination,
} from '@/data/assessments'
import { useCommandOpen, useCommandSetOpen } from '@/stores/command'
import { useResolvedTheme, useSetTheme } from '@/stores/theme'

export const GlobalCommandPalette = () => {
  const navigate = useNavigate()
  const resolvedTheme = useResolvedTheme()
  const setTheme = useSetTheme()
  const isOpen = useCommandOpen()
  const setOpen = useCommandSetOpen()
  const assessmentsByCompany = getAssessmentsGroupedByCompany()

  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const ThemeToggleIcon = nextTheme === 'dark' ? IconMoon : IconSun
  const themeToggleLabel =
    nextTheme === 'dark' ? 'Switch to dark mode' : 'Switch to light mode'

  useHotkey('Mod+K', () => {
    setOpen(true)
  })

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                navigate({ to: '/' })
              }}
            >
              <IconHome className="mr-2 size-4" />
              Open Showcase Home
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                window.open(
                  'https://github.com/anshoriacc/assessment',
                  '_blank',
                  'noopener,noreferrer',
                )
              }}
            >
              <IconBrandGithub className="mr-2 size-4" />
              Open GitHub Repository
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                void setTheme(nextTheme)
                toast.success(`Switched to ${nextTheme} mode`)
              }}
            >
              <ThemeToggleIcon className="mr-2 size-4" />
              {themeToggleLabel}
            </CommandItem>
          </CommandGroup>

          {assessmentsByCompany.map((group) => (
            <div key={group.company}>
              <CommandSeparator />
              <CommandGroup heading={`${group.company} Assessments`}>
                {group.items.map((assessment) => (
                  <CommandItem
                    key={assessment.id}
                    onSelect={() => {
                      setOpen(false)
                      if (isExternalAssessmentDestination(assessment)) {
                        window.open(
                          assessment.to,
                          '_blank',
                          'noopener,noreferrer',
                        )
                      } else {
                        navigate({ to: assessment.to })
                      }
                      toast.success(`Opening ${assessment.title}`)
                    }}
                  >
                    <IconFileText className="mr-2 size-4" />
                    {assessment.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export const CommandPaletteButton = () => {
  const setOpen = useCommandSetOpen()

  return (
    <button
      type="button"
      className="focus-visible:ring-ring ring-offset-background border-input hover:bg-accent hover:text-accent-foreground text-muted-foreground inline-flex h-10 w-full items-center justify-start rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      onClick={() => setOpen(true)}
    >
      <IconSearch className="mr-2 size-4" />
      Search assessments...
    </button>
  )
}
