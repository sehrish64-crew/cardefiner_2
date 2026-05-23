import type { Metadata } from 'next'
import PrivacyPageClient from './privacy-client'

export const metadata: Metadata = {
  title: 'Privacy Policy - cardefiner',
  description: 'Read our privacy policy to understand how cardefiner collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy - cardefiner',
    description: 'Our commitment to protecting your personal information and privacy.',
    url: 'https://cardefiner.com/privacy',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
