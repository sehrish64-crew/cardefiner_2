import type { Metadata } from 'next'
import SecurityPageClient from './security-client'

export const metadata: Metadata = {
  title: 'Security - cardefiner',
  description: 'Learn about cardefiner security measures protecting your vehicle history data with industry-leading encryption and privacy standards.',
  openGraph: {
    title: 'Security - cardefiner',
    description: 'Our commitment to data security and privacy.',
    url: 'https://cardefiner.com/security',
    type: 'website',
  },
}

export default function SecurityPage() {
  return <SecurityPageClient />
}
