'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { getCandidatesRepository } from '@/lib/repository/candidate'
import { Button } from '@/components/ui/button'
import { Trophy, Flame, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [maxVote, setMaxVote] = useState(0)

    const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
    const [allCandidatesPage, setAllCandidatesPage] = useState(1)
    const [isAllCandidatesLoading, setIsAllCandidatesLoading] = useState(false)
    const [isAllCandidatesLoaded, setIsAllCandidatesLoaded] = useState(false)

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

            if (candidates.length) {
                setMaxVote(candidates[0].votes || 1) // Prevent division by zero
            }
        }
    }

    const getAllCandidates = async () => {
        setIsAllCandidatesLoading(true)
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
            if (candidates.length !== 12) {
                setIsAllCandidatesLoaded(true)
            }
            setAllCandidatesPage(allCandidatesPage + 1)
        }
        setIsAllCandidatesLoading(false)
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

    // Animation variants
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

    const getRankBadgeStyle = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-amber-500 text-white'
            case 1:
                return 'bg-blue-500 text-white'
            case 2:
                return 'bg-rose-500 text-white'
            default:
                return 'bg-slate-500 text-white'
        }
    }

    const CandidateCard = ({
        candidate,
        index,
    }: {
        candidate: Candidate
        index: number
    }) => {
        return (
            <motion.div key={candidate.code || index} variants={itemVariants}>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xl flex-shrink-0 text-white bg-primary">
                            {index + 1}
                        </div>
                        <CandidateAvatar
                            candidate={{
                                ...candidate,
                                placement: index + 1,
                            }}
                            options={{
                                size: 64,
                                className: 'w-16 h-16',
                            }}
                        />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-base">
                                {candidate.name.split(',')[0]}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {candidate.party && `(${candidate.party})`}
                            </p>
                            <div className="flex items-center mt-1">
                                <span className="text-sm text-slate-500">
                                    Votes:
                                </span>
                                <span className="ml-1 font-medium">
                                    {candidate.votes || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Card className="bg-transparent border-none shadow-none p-0 overflow-hidden">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>Magic 12</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <motion.div
                            className="grid gap-4 md:grid-cols-3"
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
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>All Candidates</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <motion.div
                            className="grid gap-4 md:grid-cols-3"
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
