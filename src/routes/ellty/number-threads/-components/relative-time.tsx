import { format, formatDistanceToNowStrict } from 'date-fns'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type RelativeTimeProps = {
  value: Date | string | number
  className?: string
}

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatRelativeTime(value: Date | string | number): string {
  return formatDistanceToNowStrict(toDate(value), { addSuffix: true })
}

function formatFullDateTime(value: Date | string | number): string {
  return format(toDate(value), 'dd MMM yyyy, HH:mm')
}

export const RelativeTime = ({ value, className }: RelativeTimeProps) => {
  const date = toDate(value)
  const isoDateTime = date.toISOString()
  const relativeText = formatRelativeTime(value)
  const fullDateTime = formatFullDateTime(value)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <time
            dateTime={isoDateTime}
            className={
              className ??
              'text-muted-foreground cursor-default text-xs whitespace-nowrap'
            }
          >
            {relativeText}
          </time>
        }
      />
      <TooltipContent>{fullDateTime}</TooltipContent>
    </Tooltip>
  )
}
