'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { getCandidatesRepository } from '@/lib/repository/candidate'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
    const [allCandidatesPage, setAllCandidatesPage] = useState(1)

    const alreadyVoted = useMemo(() => {
        if (typeof window !== 'undefined') {
            const candidates =
                JSON.parse(localStorage.getItem('candidates') as string) || []

            return candidates.length
        }

        return false
    }, [])

    const getLeadingCandidates = async () => {
        const result = await getCandidatesRepository({
            page: 1,
            perPage: 12,
            withVotes: 1,
            sortBy: 'desc',
        })
        if (result?.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const candidates = result?.data?.data || []
            setLeadingCandidates(candidates)
        }
    }

    const getAllCandidates = async () => {
        const result = await getCandidatesRepository({
            page: allCandidatesPage,
            perPage: 66,
            withVotes: 1,
            sortBy: 'desc',
        })
        if (result?.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const candidates = result?.data?.data || []
            setAllCandidates([...allCandidates, ...candidates])
            setAllCandidatesPage(allCandidatesPage + 1)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await getLeadingCandidates()
            await getAllCandidates()
            setIsLoading(false)
        }

        loadData()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
    }

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    const CandidateCard = ({
        candidate,
        index,
    }: {
        candidate: Candidate
        index: number
    }) => {
        return (
            <motion.div key={candidate.code || index} variants={itemVariants}>
                <div className="p-4 transition-shadow relative">
                    <div className="flex items-start gap-2">
                        <div
                            className={cn(
                                'flex items-center justify-center w-8 h-8 rounded-full font-bold text-xl flex-shrink-0',
                                index + 1 <= 12
                                    ? 'text-white bg-primary'
                                    : 'text-primary'
                            )}
                        >
                            {index + 1}
                        </div>
                        <CandidateAvatar
                            candidate={{
                                ...candidate,
                                placement: index + 1,
                            }}
                            options={{
                                size: 120,
                                className: 'w-20 h-20',
                            }}
                        />
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-base md:text-lg">
                                {candidate.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-3">
                                {candidate.party && `(${candidate.party})`}
                            </p>
                            <p className="text-xl md:text-2xl font-bold">
                                {candidate.votes || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-16 max-w-7xl mx-auto">
            <div className="flex flex-col justify-center items-center gap-5 py-10">
                <div className="text-center space-y-1 px-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        iBoto Senator Mock Election 2025
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                        Shape the future of the Philippines. Sign in, cast your
                        vote, and receive your personalized Senate ballot today.
                    </p>
                </div>
                {!alreadyVoted && (
                    <Button asChild variant="default" size="lg">
                        <Link href="/dashboard/vote">Vote Now</Link>
                    </Button>
                )}
            </div>
            <Card className="bg-transparent border-none shadow-none p-0 overflow-hidden">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-bold flex items-center gap-2">
                        <span>Magic 12 🏆</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {leadingCandidates.map((candidate, index) => (
                                <CandidateCard
                                    candidate={candidate}
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
            <Card className="bg-transparent border-none shadow-none p-0 overflow-hidden">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-bold flex items-center gap-2">
                        <span>All Candidates 🔥</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {allCandidates.map((candidate, index) => (
                                <CandidateCard
                                    candidate={candidate}
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
