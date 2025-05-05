'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { getCandidatesRepository } from '@/lib/repository/candidate'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
    const [allCandidatesPage, setAllCandidatesPage] = useState(1)

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
                    <div className="flex items-start gap-1">
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
                            <h3 className="font-bold text-lg">
                                {candidate.name}
                            </h3>
                            <p className="text-md text-slate-500">
                                {candidate.party && `(${candidate.party})`}
                            </p>
                            <div className="flex items-center mt-3">
                                <p className="ml-1 font-bold text-2xl">
                                    {candidate.votes || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    iBoto Senator Results
                </h1>
                <p className="text-muted-foreground">
                    Results updated every 3 minutes...
                </p>
            </div>
            <Card className="bg-transparent border-none shadow-none p-0 overflow-hidden">
                <CardHeader className="p-0">
                    <CardTitle className="text-4xl font-bold flex items-center gap-2">
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
                    <CardTitle className="text-4xl font-bold flex items-center gap-2">
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
