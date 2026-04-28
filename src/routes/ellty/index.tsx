import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/ellty/')({
  beforeLoad: () => {
    throw notFound()
  },
  component: ElltyLayout,
})

function ElltyLayout() {
  return <></>
}
