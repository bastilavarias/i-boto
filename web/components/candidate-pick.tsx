'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Candidate } from '@/type'

export type CandidatePickProps = {
    title?: string
    subtitle?: string
    hashtag?: string
    footer?: string
    candidates: Candidate[]
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    textColor?: string
    subtitleTextColor?: string
    className?: string
    borderRadius?: string
    borderWidth?: string
}

export default function CandidatePick({
    title = 'RED THEME',
    subtitle = 'CUSTOM COLOR EXAMPLE',
    hashtag = '#Halalan2025',
    footer = 'RED.EXAMPLE.COM',
    candidates,
    primaryColor = '#990000',
    secondaryColor = '#0a3b7d',
    accentColor = '#cc0000',
    textColor = '#ffffff',
    subtitleTextColor = '#ffffff',
    className = '',
    borderRadius = '0.75rem',
    borderWidth = '2px',
}: CandidatePickProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const sortedSenators = [...candidates].sort(
        (a, b) => a.placement - b.placement
    )
    const leftColumnSenators = sortedSenators.filter(
        (candidate) => candidate.placement % 2 !== 0
    )
    const rightColumnSenators = sortedSenators.filter(
        (candidate) => candidate.placement % 2 === 0
    )

    const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
        return (
            <div
                className="relative flex items-center rounded pl-4 py-2"
                style={{ backgroundColor: secondaryColor }}
            >
                <div className="absolute left-0">
                    <div className="relative flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 m-1">
                        <Image
                            src={`/images/candidates/2025/senate/${candidate.code}.png`}
                            alt={candidate.name}
                            width={100}
                            height={100}
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-center pl-28 pr-3">
                    <h3
                        className="text-xl font-extrabold leading-tight md:text-2xl"
                        style={{ color: textColor }}
                    >
                        {candidate.name}
                    </h3>
                    {candidate.placement && (
                        <p
                            className="font-medium uppercase"
                            style={{
                                color: textColor,
                                opacity: 0.8,
                            }}
                        >
                            {candidate.party}
                        </p>
                    )}
                </div>

                <p
                    className="absolute right-0 font-black transform rotate-[1rad]"
                    style={{ color: textColor, fontSize: '5rem' }}
                >
                    {candidate.placement}
                </p>
            </div>
        )
    }

    return (
        <div
            className={cn('', className)}
            style={{ backgroundColor: primaryColor }}
        >
            <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2">
                <div className="flex flex-col gap-10">
                    {leftColumnSenators.map((candidate) => (
                        <CandidateCard
                            candidate={candidate}
                            key={candidate.code}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-10">
                    {rightColumnSenators.map((candidate) => (
                        <CandidateCard
                            candidate={candidate}
                            key={candidate.code}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
