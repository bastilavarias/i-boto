'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import Image from 'next/image'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { Candidate } from '@/type'
import { Vote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { candidates } from '@/data'

export function ReceiptContent() {
    const [candidateCodes, setCandidateCodes] = useState([])
    const [colors, setColors] = useState({
        text: '#000000',
        bg: '#FFFFFF',
    })

    const surveyRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

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
            container.style.paddingBottom = '60px'
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

    useEffect(() => {
        const localCandidates =
            JSON.parse(localStorage.getItem('candidates') as string) || []
        if (!localCandidates.length) {
            router.push('/dashboard')
        }
        console.log(localCandidates)
        setCandidateCodes(localCandidates)
    }, [])

    const filteredCandidates = useMemo(
        () =>
            candidateCodes
                .map((code: Candidate) => {
                    const candidate =
                        candidates.find(
                            (_candidate) => _candidate.code === code
                        ) || null
                    if (candidate) {
                        return candidate
                    }
                    return null
                })
                .filter((candidate) => candidate),
        [candidates, candidateCodes]
    )

    return (
        <div className="p-4 md:p-6 font-sans min-h-screen bg-gray-50">
            {filteredCandidates.length && (
                <div className="mx-auto">
                    <Card className="mb-5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Customize Local Receipt
                            </CardTitle>
                            <Vote className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                                {Object.entries(colors).map(([key, value]) => (
                                    <div key={key}>
                                        <Label
                                            htmlFor={key}
                                            className="capitalize mb-2"
                                        >
                                            {key} Color
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-8 h-8 rounded-md border cursor-pointer"
                                                        style={{
                                                            backgroundColor:
                                                                value,
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
                                Download
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Preview</h2>
                        <div className="border-2 border-dashed p-4 rounded-lg overflow-x-auto">
                            <ReceiptPreview
                                colors={colors}
                                candidates={filteredCandidates}
                                ref={surveyRef}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// eslint-disable-next-line react/display-name
const ReceiptPreview = React.forwardRef<
    HTMLDivElement,
    {
        colors: {
            text: string
            bg: string
        }
        candidates: Candidate[]
    }
>(({ colors, candidates }, ref) => (
    <div
        ref={ref}
        className="receipt-preview min-w-[1080px] overflow-x-auto space-y-10"
        style={{
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Poppins', sans-serif",
            width: '100%',
            boxSizing: 'border-box',
            padding: '2rem',
        }}
    >
        <div className="flex justify-between items-center mb-10">
            <div
                className="flex items-center space-x-2"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Image
                    width={50}
                    height={50}
                    alt="Republika ng Pilipinas"
                    src="/logo/republika-ng-pilipinas.png"
                />
                <p
                    className="text-xl"
                    style={{
                        color: colors.text,
                        fontWeight: 'bold',
                    }}
                >
                    iBoto Mock Election
                </p>
            </div>

            <h2
                style={{
                    color: colors.text,
                    fontSize: '30px',
                    lineHeight: '1.2',
                    fontWeight: 'bolder',
                }}
            >
                iBoto
            </h2>
        </div>

        <div>
            <div className="flex justify-center mb-10">
                <h1
                    style={{
                        color: colors.text,
                        fontSize: '40px',
                        lineHeight: '1.2',
                        fontWeight: 'bold',
                    }}
                >
                    My 2025 Senatorial Picks
                </h1>
            </div>

            <div
                className="grid grid-cols-2 gap-8 mb-10"
                style={{ fontSize: '18px' }}
            >
                {candidates.map((candidate: Candidate, index: number) => {
                    const order = index + 1
                    return (
                        <div
                            key={candidate.placement}
                            className="flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center space-x-3">
                                <CandidateAvatar candidate={candidate} />
                                <div className="flex items-center justify-center space-x-3">
                                    <div
                                        className="font-bold text-5xl"
                                        style={{
                                            color:
                                                order <= 3
                                                    ? colors.text
                                                    : colors.text,
                                        }}
                                    >
                                        {order}.
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                        <p
                                            className="text-2xl font-bold leading-none"
                                            style={{
                                                color: colors.text,
                                                marginBottom: 0,
                                            }}
                                        >
                                            {candidate.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {candidate.party}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mb-15">
                <p
                    className="text-center text-muted-foreground italic"
                    style={{
                        fontSize: '16px',
                    }}
                >
                    The image above shows the results of the 2025 Senatorial
                    Mock Election based on user votes submitted through
                    www.iboto.vercel.app. iBoto is a decentralized and
                    transparent platform created to simulate the voting process
                    and encourage civic engagement through technology. While
                    these results are not official, they reflect the preferences
                    of participants who took part in the mock election.
                </p>
            </div>

            <div>
                <p
                    className="text-center"
                    style={{
                        fontSize: '16px',
                        color: colors.text,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                    }}
                >
                    https://iboto.vercel.app
                </p>
            </div>
        </div>
    </div>
))
