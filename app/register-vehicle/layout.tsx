import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register Vehicle - cardefiner',
  description: 'Register your vehicle on cardefiner',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
