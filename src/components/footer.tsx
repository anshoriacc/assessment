import { ToggleTheme } from './toggle-theme'

export const Footer = () => {
  return (
    <footer className="bg-background/80 mt-auto border-t">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Built as a technical assessment showcase.
        </p>
        <ToggleTheme />
      </div>
    </footer>
  )
}
