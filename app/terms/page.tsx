import type { Metadata } from 'next'
import TermsPageClient from './terms-client'

export const metadata: Metadata = {
  title: 'Terms and Conditions - cardefiner',
  description: 'Read the terms and conditions for using cardefiner services. Understand your rights and responsibilities.',
  openGraph: {
    title: 'Terms and Conditions - cardefiner',
    description: 'Our terms explain the rules for using cardefiner vehicle history reports.',
    url: 'https://cardefiner.com/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  return <TermsPageClient />
}
