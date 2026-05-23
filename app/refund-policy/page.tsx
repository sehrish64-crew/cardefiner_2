import type { Metadata } from 'next'
import RefundPolicyPageClient from './refund-policy-client'

export const metadata: Metadata = {
  title: 'Refund Policy - cardefiner',
  description: 'Learn about cardefiner refund policy and how to request a refund for your vehicle history report.',
  openGraph: {
    title: 'Refund Policy - cardefiner',
    description: 'Our customer-friendly refund policy details.',
    url: 'https://cardefiner.com/refund-policy',
    type: 'website',
  },
}

export default function RefundPolicyPage() {
  return <RefundPolicyPageClient />
}
