'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toPng, getFontEmbedCSS } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { Candidate } from '@/type'
import { Star, Vote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { candidates } from '@/data'
import { truncate } from '@/lib/utils'
import { useToPng } from '@hugocxl/react-to-image'

export function ReceiptContent() {
    const [candidateCodes, setCandidateCodes] = useState([])
    const [colors, setColors] = useState({ text: '#000000', bg: '#FFFFFF' })
    const [theme] = useState('philippines')

    const previewReference = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        setColors((prev) => ({ ...prev, [key]: value }))
    }

    const downloadImage = async () => {
        convertToPng()
    }

    const [state, convertToPng, pngRef] = useToPng<HTMLDivElement>({
        onSuccess: (data) => {
            console.log(data)
        },
    })

    useEffect(() => {
        const localCandidates =
            JSON.parse(localStorage.getItem('candidates') as string) || []
        if (!localCandidates.length) router.push('/dashboard')
        setCandidateCodes(localCandidates)
    }, [])

    const filteredCandidates = useMemo(
        () =>
            candidateCodes
                .map(
                    (code: Candidate) =>
                        candidates.find((_c) => _c.code === code) || null
                )
                .filter(Boolean),
        [candidateCodes]
    )

    return (
        <div className="p-4 md:p-6 font-sans min-h-screen bg-gray-50">
            {!!filteredCandidates.length && (
                <div className="mx-auto">
                    <Card className="mb-5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                        <h2 className="text-xl font-semibold mb-3">Preview</h2>
                        <div
                            className="border-2 border-dashed p-4 rounded-lg overflow-x-auto"
                            ref={pngRef}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            {theme === 'philippines' && (
                                <PhilippinesTheme
                                    colors={colors}
                                    candidates={filteredCandidates}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const PhilippinesTheme = React.forwardRef<
    HTMLDivElement,
    {
        colors: { text: string; bg: string }
        candidates: Candidate[]
    }
>(({ candidates }, ref) => {
    const yellow = '#ecbe26'
    const blue = '#22229c'
    const red = '#781d47'

    const Logo = ({ domain }: { domain: boolean }) => (
        <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <Star key={`l-${i}`} color={yellow} fill={yellow} />
                    ))}
                </div>
                <p className="text-white text-6xl font-black">iBoto</p>
                <div className="flex items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <Star key={`r-${i}`} color={yellow} fill={yellow} />
                    ))}
                </div>
            </div>
            <p className="text-white font-bold text-xl">
                {domain
                    ? 'www.iboto.vercel.app'
                    : 'Decentralized Mock Election Platform'}
            </p>
        </div>
    )

    return (
        <div
            ref={ref}
            className="min-w-[1080px] p-10 space-y-15"
            style={{
                fontFamily: "'Poppins', sans-serif",
                width: '100%',
                boxSizing: 'border-box',
                background: `url('/images/philippines-map.png'), linear-gradient(to bottom, ${blue}, ${red})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
                backgroundSize: 'auto 110%',
            }}
        >
            <Logo domain={false} />
            <div className="flex flex-col items-center">
                <p className="text-white text-6xl font-bold">
                    I voted for these Senators
                </p>
            </div>
            <div
                className="grid grid-cols-2 gap-15"
                style={{ fontSize: '18px' }}
            >
                {candidates.map((candidate, index) => (
                    <div
                        key={candidate.placement}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center space-x-5 w-full">
                            <div className="font-bold text-6xl text-white">
                                {index + 1}
                            </div>
                            <div className="flex items-center justify-start pl-28 pr-2 py-4 bg-white w-full relative py-2 rounded-l-4xl rounded-br-4xl">
                                <div className="overflow-hidden flex flex-col items-start justify-start truncate">
                                    <p className="text-2xl font-bold leading-none text-[#22229c]">
                                        {truncate(candidate.name, 15)}
                                    </p>
                                    <p className="text-[#781d47] font-medium">
                                        {candidate.party}
                                    </p>
                                </div>
                                <div className="absolute -top-2.5 -left-1.5">
                                    <div className="relative rounded-full p-[4px] bg-gradient-to-r from-[#22229c] to-[#781d47]">
                                        <CandidateAvatar
                                            candidate={candidate}
                                            options={{ size: 100 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col justify-center items-center space-y-5">
                <Logo domain={true} />
                <p
                    className="text-8xl font-bold"
                    style={{
                        backgroundImage: "url('/images/philippine-flag.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                    }}
                >
                    #HALALAN2025
                </p>
            </div>
        </div>
    )
})
