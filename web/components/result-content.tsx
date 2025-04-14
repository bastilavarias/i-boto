'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { cn, truncate } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { getCandidatesRepository } from '@/lib/repository/candidate'
import { Button } from '@/components/ui/button'

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
                setMaxVote(candidates[0].votes)
            }
        }
    }

    const getAllCandidates = async () => {
        setIsAllCandidatesLoading(true)
        const result = await getCandidatesRepository({
            page: allCandidatesPage,
            perPage: 12,
            withVotes: 1,
            sortBy: 'desc',
        })
        if (result?.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const candidates = result?.data?.data || []
            setAllCandidates([...allCandidates, ...candidates])
            if (candidates.length != 12) {
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

    return (
        <div className="space-y-14">
            <Card className="shadow-none border-0 bg-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        🏆 Magic 12
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-20 md:grid-cols-2 xl:grid-cols-3">
                            {leadingCandidates.map((candidate, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-start space-x-5 w-full">
                                        <div className="font-bold text-4xl">
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center justify-start pl-28 pr-2 py-4 w-full relative py-2 rounded-l-4xl">
                                            <div className="overflow-hidden flex flex-col items-start justify-center truncate space-y-1">
                                                <p className="text-2xl font-bold leading-none">
                                                    {truncate(
                                                        candidate?.name,
                                                        11
                                                    )}
                                                </p>
                                                <p className="text-xl">
                                                    Votes:{' '}
                                                    <span className="font-bold">
                                                        {candidate?.votes}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="absolute -top-3.6 -left-2">
                                                <div className="relative rounded-full p-[4px]">
                                                    <CandidateAvatar
                                                        candidate={candidate}
                                                        options={{
                                                            size: 120,
                                                            className:
                                                                'w-24 h-24',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-none border-0 bg-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        🔥 All Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                            {allCandidates.map((candidate, index) => (
                                <div
                                    key={candidate.code}
                                    className="flex items-start gap-3 p-3 border rounded-md space-y-4 bg-white"
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-center w-8 h-8 rounded-full  font-bold text-sm flex-shrink-0',
                                            index + 1 > 3
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-green-100 text-green-800'
                                        )}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex items-center gap-2 flex-1  h-full">
                                        <CandidateAvatar
                                            candidate={candidate}
                                            options={{
                                                className: 'w-24 h-24',
                                            }}
                                        />
                                        <div className="space-y-2 w-full flex flex-col h-full">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div>
                                                    <p className="font-medium cursor-pointer">
                                                        {candidate.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ({candidate.party})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full space-y-1">
                                                <p className="font-medium">
                                                    <span className="text-muted-foreground text-sm">
                                                        Votes:
                                                    </span>{' '}
                                                    <span className="text-md">
                                                        {candidate.votes.toLocaleString()}
                                                    </span>
                                                </p>
                                                <Progress
                                                    value={
                                                        (candidate.votes /
                                                            maxVote) *
                                                        100
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>

                {!isAllCandidatesLoaded && !isLoading && (
                    <CardFooter
                        className="justify-center"
                        onClick={getAllCandidates}
                    >
                        <Button
                            variant="outline"
                            disabled={isAllCandidatesLoading}
                        >
                            Load more
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
