'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { truncate } from '@/lib/utils'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { candidates } from '@/data'
import { Candidate } from '@/type'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

interface VoteReceiptProps {
    dataFrom: 'url' | 'storage'
}

export function VoteReceipt({ dataFrom }: VoteReceiptProps) {
    const COLORS = {
        yellow: '#FCD116',
        blue: '#22229c',
        red: '#781d47',
    }
    const TEXT = {
        logo: {
            main: 'iBoto',
            subtitle: 'Decentralized Mock Election Website',
        },
        heading: 'I voted for these Senators',
        footer: {
            hashtag: '#HALALAN2025',
            website: 'www.iboto.vercel.app',
            qoute: `“Your vote is your voice. Make it count for someone who
                        speaks for you, not over you.”`,
        },
    }
    const searchParams = useSearchParams()
    const [codes, setCodes] = useState([])

    useEffect(() => {
        if (typeof window === 'undefined') return

        if (dataFrom === 'url') {
            // Get codes from URL query parameters
            const urlCodes = searchParams?.get('codes')
            if (urlCodes) {
                const parsedCodes = urlCodes.split(',')
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setCodes(parsedCodes)
            }
        } else if (dataFrom === 'storage') {
            const storedCodes = localStorage.getItem('candidates')
            if (storedCodes) {
                try {
                    const parsedCodes = JSON.parse(storedCodes)
                    if (Array.isArray(parsedCodes)) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        setCodes(parsedCodes)
                    }
                } catch (error) {
                    console.error('Failed to parse stored candidates', error)
                }
            }
        }
    }, [dataFrom, searchParams])

    const filteredCandidates = useMemo(() => {
        const _candidates = []
        for (let i = 0; i < 12; i++) {
            const code = codes[i] || null
            if (code) {
                const _candidate =
                    candidates.find((candidate) => candidate.code === code) ||
                    null
                _candidates.push(_candidate)
            }
            _candidates.push(null)
        }

        return _candidates.filter((candidate) => candidate) // Fix this it should support null
    }, [codes])

    const Logo = () => (
        <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-2">
                    {[...Array(8)].map((_, i) => (
                        <Star
                            key={`l-${i}`}
                            color={COLORS.yellow}
                            fill={COLORS.yellow}
                        />
                    ))}
                </div>
                <p className="text-white text-6xl font-black">
                    {TEXT.logo.main}
                </p>
                <div className="flex items-center space-x-2">
                    {[...Array(8)].map((_, i) => (
                        <Star
                            key={`r-${i}`}
                            color={COLORS.yellow}
                            fill={COLORS.yellow}
                        />
                    ))}
                </div>
            </div>
            <p className="text-white font-bold text-3xl">
                {TEXT.logo.subtitle}
            </p>
        </div>
    )

    return (
        <div
            id="receipt-template"
            className={`min-w-[1080px] p-10 space-y-32 font-['Poppins'] w-full box-border`}
            style={{
                background: `url('/images/philippines-map.png'), linear-gradient(to bottom, ${COLORS.blue}, ${COLORS.red})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
                backgroundSize: 'auto 110%',
            }}
        >
            <div className="space-y-20">
                <Logo />
                <div className="flex flex-col items-center">
                    <p className="text-white text-6xl font-bold">
                        {TEXT.heading}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-20">
                    {filteredCandidates.map(
                        (candidate: Candidate | null, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center space-x-5 w-full">
                                        <div
                                            className="font-bold text-6xl"
                                            style={{
                                                color: candidate
                                                    ? COLORS.yellow
                                                    : 'white',
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center justify-start pl-40 pr-2 py-4 bg-white w-full relative py-2 rounded-l-4xl rounded-br-4xl">
                                            <div className="overflow-hidden flex flex-col items-start justify-center truncate">
                                                <p
                                                    className="text-4xl font-bold leading-none"
                                                    style={{
                                                        color: COLORS.blue,
                                                    }}
                                                >
                                                    {truncate(
                                                        candidate?.name ||
                                                            'Vacant',
                                                        11
                                                    )}
                                                </p>
                                                <p
                                                    className="font-medium text-xl"
                                                    style={{
                                                        color: COLORS.red,
                                                    }}
                                                >
                                                    {candidate?.party ||
                                                        'No candidate selected'}
                                                </p>
                                            </div>
                                            <div className="absolute -top-3.6 -left-2">
                                                <div
                                                    className="relative rounded-full p-[4px]"
                                                    style={{
                                                        backgroundImage: `linear-gradient(to right, ${COLORS.blue}, ${COLORS.red})`,
                                                    }}
                                                >
                                                    {candidate ? (
                                                        <CandidateAvatar
                                                            candidate={
                                                                candidate
                                                            }
                                                            options={{
                                                                size: 120,
                                                                className:
                                                                    'w-36 h-36',
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-36 h-36 rounded-full bg-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center space-y-20">
                <div className="flex justify-between items-center w-full">
                    <p className="text-8xl font-bold bg-[url('/images/philippine-flag.png')] bg-cover bg-center bg-clip-text text-transparent">
                        {TEXT.footer.hashtag}
                    </p>
                    <div className="flex flex-col justify-center items-center space-y-5">
                        <Image
                            width={200}
                            height={200}
                            src="/images/qr.png"
                            alt="Scan QR"
                        />
                        <p className="text-white font-bold text-3xl">
                            {TEXT.footer.website}
                        </p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <p className="text-2xl italic font-semibold text-white">
                        {TEXT.footer.qoute}
                    </p>
                </div>
            </div>
        </div>
    )
}
