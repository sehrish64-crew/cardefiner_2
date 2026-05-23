import { Metadata } from 'next'
import AboutUsClient from './about-us-client'

export const metadata: Metadata = {
  title: 'About cardefiner - Vehicle History Transparency',
  description:
    'Learn how cardefiner is driving transparency in the automotive industry with vehicle history reports from 900+ global databases.',
  openGraph: {
    title: 'About cardefiner - Vehicle History Transparency',
    description:
      'Learn how cardefiner is driving transparency in the automotive industry with vehicle history reports from 900+ global databases.',
    url: 'https://cardefiner.com/about-us',
    type: 'website',
  },
}

export default function AboutUs() {
  return <AboutUsClient />
}
