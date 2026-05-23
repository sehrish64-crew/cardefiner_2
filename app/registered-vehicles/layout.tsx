import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Registered Vehicles - cardefiner',
  description: 'View and manage registered vehicles on cardefiner',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
