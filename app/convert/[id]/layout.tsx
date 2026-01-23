import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
