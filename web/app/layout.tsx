import type { Metadata } from 'next'
import { Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sansSerif = Poppins({
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    preload: true,
    subsets: ['latin'],
})

const mono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono',
    preload: true,
})

export const metadata: Metadata = {
    title: 'iBoto | Philippines 2025 Senatorial Election',
    description:
        'Stay informed and make your vote count with iBoto — your trusted platform for learning about candidates, comparing their platforms, and tracking senatorial election updates for the 2025 Philippines elections.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${sansSerif.variable} ${mono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
