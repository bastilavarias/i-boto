'use client'

import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

// eslint-disable-next-line react/display-name
const ReceiptPreview = React.forwardRef<
    HTMLDivElement,
    {
        colors: {
            primary: string
            secondary: string
            text: string
            accent: string
            bg: string
        }
        candidates: {
            rank: number
            name: string
            party: string
            score: number
        }[]
    }
>(({ colors, candidates }, ref) => (
    <div
        ref={ref}
        className="survey-content"
        style={{
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Poppins', sans-serif",
            width: '100%',
            boxSizing: 'border-box',
        }}
    >
        {/* Header with fixed sizing */}
        <div className="mb-8" style={{ fontSize: '28px', lineHeight: '1.2' }}>
            <div
                className="font-bold uppercase tracking-wider mb-1"
                style={{ color: colors.primary }}
            >
                ARKIPELAGO ANALYTICS
            </div>
            <div
                className="font-bold uppercase tracking-wider mb-2"
                style={{ color: colors.primary }}
            >
                SURVEY
            </div>
            <div
                className="font-semibold uppercase tracking-wider"
                style={{
                    color: colors.secondary,
                    fontSize: '24px',
                }}
            >
                2025 SENATORIAL PREFERENCES
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div
                className="font-medium italic"
                style={{
                    color: colors.accent,
                    fontSize: '20px',
                }}
            >
                arkipelago
            </div>
            <div style={{ fontSize: '16px', maxWidth: '600px' }}>
                The latest Arkipelago Analytics survey, conducted from March 15
                to 21, 2025, shows
                <br />
                reelectionist Sen. Bong Go leading with 64 percent of the vote.
            </div>
        </div>

        {/* Candidates List with fixed sizing */}
        <div className="space-y-2" style={{ fontSize: '18px' }}>
            {candidates.map((candidate) => (
                <div
                    key={candidate.rank}
                    className="flex items-baseline gap-4"
                    style={{ lineHeight: '1.4' }}
                >
                    <div
                        className="font-bold w-8 text-right flex-shrink-0"
                        style={{
                            color:
                                candidate.rank <= 3
                                    ? colors.accent
                                    : colors.text,
                        }}
                    >
                        {candidate.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">
                            {candidate.name}
                        </div>
                        <div
                            style={{
                                fontSize: '14px',
                                opacity: 0.8,
                            }}
                        >
                            ({candidate.party})
                        </div>
                    </div>
                    <div
                        className="font-bold flex-shrink-0"
                        style={{
                            color:
                                candidate.rank <= 3
                                    ? colors.accent
                                    : colors.text,
                        }}
                    >
                        {candidate.score.toFixed(1)}
                    </div>
                </div>
            ))}
        </div>
    </div>
))

export function ReceiptContent() {
    const [colors, setColors] = useState({
        primary: '#1E40AF',
        secondary: '#1E3A8A',
        text: '#1F2937',
        accent: '#DC2626',
        bg: '#FFFFFF',
    })

    const surveyRef = useRef<HTMLDivElement>(null)

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        setColors((prev) => ({ ...prev, [key]: value }))
    }

    const downloadImage = async () => {
        if (!surveyRef.current) return

        try {
            const container = document.createElement('div')
            container.style.position = 'fixed'
            container.style.left = '0'
            container.style.top = '0'
            container.style.width = '1080px'
            container.style.padding = '40px'
            container.style.backgroundColor = colors.bg
            container.style.zIndex = '99999'
            container.style.fontFamily = "'Poppins', sans-serif"
            document.body.appendChild(container)

            const clone = surveyRef.current.cloneNode(true) as HTMLDivElement
            clone.style.width = '100%'
            clone.style.padding = '0'
            clone.style.margin = '0'
            clone.style.boxSizing = 'border-box'
            clone.className = ''
            clone.style.fontSize = '24px'

            container.appendChild(clone)

            const canvas = await html2canvas(container, {
                scale: 1,
                width: 1080,
                height: container.scrollHeight,
                logging: true,
                useCORS: true,
                backgroundColor: colors.bg,
                windowWidth: 1080,
                windowHeight: container.scrollHeight,
            })

            document.body.removeChild(container)

            const link = document.createElement('a')
            link.download = 'senatorial-survey-2025.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Error generating image:', error)
        }
    }

    const candidates = [
        { rank: 1, name: 'GO, BONG GO', party: 'PDPLBN', score: 64.0 },
    ]

    return (
        <div className="p-4 md:p-6 font-sans min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Customize Survey Appearance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                            {Object.entries(colors).map(([key, value]) => (
                                <div key={key}>
                                    <Label htmlFor={key} className="capitalize">
                                        {key} Color
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-8 h-8 rounded-md border cursor-pointer"
                                                    style={{
                                                        backgroundColor: value,
                                                    }}
                                                />
                                                <Input
                                                    id={key}
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleColorChange(
                                                            key as keyof typeof colors,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-fit p-0">
                                            <Input
                                                type="color"
                                                value={value}
                                                onChange={(e) =>
                                                    handleColorChange(
                                                        key as keyof typeof colors,
                                                        e.target.value
                                                    )
                                                }
                                                className="border-0 p-0 h-64 w-64 cursor-pointer"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={downloadImage}
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            Download as Image (1080px)
                        </Button>
                    </CardContent>
                </Card>

                {/* Preview Section */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Preview</h2>
                    <div className="border-2 border-dashed p-4 rounded-lg">
                        <ReceiptPreview
                            colors={colors}
                            candidates={candidates}
                            ref={surveyRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
