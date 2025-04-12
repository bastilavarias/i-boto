'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { BarChart, Clock, Clock4, Search } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Candidate } from '@/type'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const [maxVote, setMaxVote] = useState(0)

    const getLeadingCandidates = async () => {
        const response = await fetch(
            'http://localhost:3333/api/candidate?page=1&perPage=12&withVotes=1&sortBy=desc'
        )
        if (response.ok) {
            const jsonData = await response.json()
            const candidates = jsonData.data
            setLeadingCandidates(candidates)

            if (candidates.length) {
                setMaxVote(candidates[0].votes)
            }
        }

        setCandidates([])
    }

    function formatDate(dateString: string) {
        const now = new Date()
        const past = new Date(dateString)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const diff = Math.floor((now - past) / 1000)

        if (diff < 60) return `${diff} seconds ago`
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`

        return past.toLocaleDateString()
    }

    useEffect(() => {
        const loadResults = async () => {
            setLoading(true)
            await getLeadingCandidates()

            setLoading(false)
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
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                            {leadingCandidates.map((candidate, index) => (
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
            </Card>

            <Card className="shadow-none border-0 pt-0 bg-none bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        🔥 All Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                            {leadingCandidates.map((candidate, index) => (
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
            </Card>
        </div>
    )
}
