import { useLocation, useNavigate } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const GlobalBackButton = () => {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname === '/') {
    return null
  }

  return (
    <div
      aria-hidden
      className="bg-background/35 `mask-[linear-gradient(to_bottom,black_50%,transparent)] pointer-events-none fixed inset-x-0 top-0 z-2 h-16 backdrop-blur-xs [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent)]"
    >
      <div className="pointer-events-none container mx-auto p-4">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Back"
                className="pointer-events-auto"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back()
                    return
                  }

                  navigate({ to: '/' })
                }}
              >
                <IconArrowLeft />
              </Button>
            }
          />
          <TooltipContent>
            <span>Back</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
