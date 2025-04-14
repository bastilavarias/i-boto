'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Clock, Clock4 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { cn, truncate } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { getCandidatesRepository } from '@/lib/repository/candidate'
import { Button } from '@/components/ui/button'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdated] = useState<string | null>(null)
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

    // function formatDate(dateString: string) {
    //     const now = new Date()
    //     const past = new Date(dateString)
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-expect-error
    //     const diff = Math.floor((now - past) / 1000)
    //
    //     if (diff < 60) return `${diff} seconds ago`
    //     if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    //     if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    //     if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
    //
    //     return past.toLocaleDateString()
    // }

    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true)
            await getLeadingCandidates()
            await getAllCandidates()

            setIsLoading(false)
        }

        loadResults()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Election Results
                </h1>
                <p className="text-gray-500 flex items-center">
                    <Clock4 className="h-5 w-5 mr-1" />
                    Updated 5 minutes ago...
                </p>
            </div>

            {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                        Last updated:{' '}
                        {format(
                            parseISO(lastUpdated),
                            "MMMM d, yyyy 'at' h:mm a"
                        )}
                    </span>
                </div>
            )}

            <Card className="shadow-none border-0 pt-0 bg-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        🏆 Magic 12
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-20 md:grid-cols-2">
                            {leadingCandidates.map((candidate, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center space-x-5 w-full">
                                        <div className="font-bold text-6xl">
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center justify-start pl-32 pr-2 py-4 bg-white w-full relative py-2 rounded-l-4xl rounded-br-4xl">
                                            <div className="overflow-hidden flex flex-col items-start justify-center truncate">
                                                <p className="text-4xl font-bold leading-none">
                                                    {truncate(
                                                        candidate?.name ||
                                                            'Vacant',
                                                        11
                                                    )}
                                                </p>
                                                <p className="font-medium text-xl">
                                                    {candidate?.party ||
                                                        'No candidate selected'}
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
                                // <div
                                //     key={candidate.code}
                                //     className="flex items-start gap-3 p-3 border rounded-md space-y-4 bg-white"
                                // >
                                //     <div
                                //         className={cn(
                                //             'flex items-center justify-center w-8 h-8 rounded-full  font-bold text-sm flex-shrink-0',
                                //             index + 1 > 3
                                //                 ? 'bg-gray-100 text-gray-800'
                                //                 : 'bg-green-100 text-green-800'
                                //         )}
                                //     >
                                //         {index + 1}
                                //     </div>
                                //     <div className="flex items-center gap-2 flex-1  h-full">
                                //         <CandidateAvatar
                                //             candidate={candidate}
                                //             options={{
                                //                 className: 'w-24 h-24',
                                //             }}
                                //         />
                                //         <div className="space-y-2 w-full flex flex-col h-full">
                                //             <div className="flex items-center gap-3 flex-1">
                                //                 <div>
                                //                     <p className="font-medium cursor-pointer">
                                //                         {candidate.name}
                                //                     </p>
                                //                     <p className="text-sm text-gray-500">
                                //                         ({candidate.party})
                                //                     </p>
                                //                 </div>
                                //             </div>
                                //
                                //             <div className="w-full space-y-1">
                                //                 <p className="font-medium">
                                //                     <span className="text-muted-foreground text-sm">
                                //                         Votes:
                                //                     </span>{' '}
                                //                     <span className="text-md">
                                //                         {candidate.votes.toLocaleString()}
                                //                     </span>
                                //                 </p>
                                //                 <Progress
                                //                     value={
                                //                         (candidate.votes /
                                //                             maxVote) *
                                //                         100
                                //                     }
                                //                 />
                                //             </div>
                                //         </div>
                                //     </div>
                                // </div>
                                //
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-none border-0 pt-0 bg-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
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
