import React, { useMemo } from 'react'
import { Star } from 'lucide-react'
import { truncate } from '@/lib/utils'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { candidates } from '@/data'
import { Candidate } from '@/type'
import Image from 'next/image'

interface VoteReceiptProps {
    codes: string[]
}

export function VoteReceipt({ codes }: VoteReceiptProps) {
    const COLORS = {
        yellow: '#ecbe26',
        blue: '#22229c',
        red: '#781d47',
    }
    const TEXT = {
        logo: {
            main: 'iBoto',
            subtitle: 'Decentralized Mock Election Platform',
        },
        heading: 'I voted for these Senators',
        footer: {
            hashtag: '#HALALAN2025',
            website: 'www.iboto.vercel.app',
            qoute: `“Your vote is your voice. Make it count for someone who
                        speaks for you, not over you.”`,
        },
    }

    const filteredCandidates = useMemo(
        () =>
            codes
                .map((code: string) =>
                    candidates.find((_c) => _c.code === code)
                )
                .filter(Boolean),
        [codes]
    )

    const Logo = () => (
        <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
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
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={`r-${i}`}
                            color={COLORS.yellow}
                            fill={COLORS.yellow}
                        />
                    ))}
                </div>
            </div>
            <p className="text-white font-bold text-xl">{TEXT.logo.subtitle}</p>
        </div>
    )

    return (
        <div
            id="receipt-template"
            className={`min-w-[1080px] p-10 space-y-15 font-['Poppins'] w-full box-border`}
            style={{
                background: `url('/images/philippines-map.png'), linear-gradient(to bottom, ${COLORS.blue}, ${COLORS.red})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply',
                backgroundSize: 'auto 110%',
            }}
        >
            <Logo />
            <div className="flex flex-col items-center">
                <p className="text-white text-6xl font-bold">{TEXT.heading}</p>
            </div>
            <div className="grid grid-cols-2 gap-20">
                {filteredCandidates.map(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    (candidate: Candidate, index: number) => {
                        return (
                            <div
                                key={candidate?.placement}
                                className="flex items-center justify-between gap-4"
                            >
                                {candidate && (
                                    <div className="flex items-center space-x-5 w-full">
                                        <div className="font-bold text-6xl text-white">
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center justify-start pl-32 pr-2 py-4 bg-white w-full relative py-2 rounded-l-4xl rounded-br-4xl">
                                            <div className="overflow-hidden flex flex-col items-start justify-start truncate">
                                                <p
                                                    className={`text-3xl font-bold leading-none text-[${COLORS.blue}]`}
                                                >
                                                    {truncate(
                                                        candidate.name,
                                                        15
                                                    )}
                                                </p>
                                                <p
                                                    className={`text-[${COLORS.red}] font-medium`}
                                                >
                                                    {candidate.party}
                                                </p>
                                            </div>
                                            <div className="absolute -top-3.6 -left-2">
                                                <div
                                                    className={`relative rounded-full p-[4px] bg-gradient-to-r from-[${COLORS.blue}] to-[${COLORS.red}]`}
                                                >
                                                    <CandidateAvatar
                                                        candidate={candidate}
                                                        options={{
                                                            size: 100,
                                                            className:
                                                                'w-30 h-30',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                )}
            </div>
            <div className="flex flex-col justify-center items-center space-y-20">
                <div className="flex justify-between items-center w-full">
                    <p
                        className="text-8xl font-bold bg-[url('/images/philippine-flag.png')] bg-cover bg-center bg-clip-text text-transparent
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
                    >
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
