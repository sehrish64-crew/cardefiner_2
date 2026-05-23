import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Database Setup - cardefiner',
  description: 'Database setup and diagnostics for cardefiner',
}

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
