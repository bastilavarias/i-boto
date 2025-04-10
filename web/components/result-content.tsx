'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { BarChart, Clock, Clock4, Search } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Candidate } from '@/type'
import Image from 'next/image'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { cn } from '@/lib/utils'

export function ResultContent() {
    const [leadingCandidates, setLeadingCandidates] = useState<Candidate[]>([])
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const [maxVote, setMaxVote] = useState(1000)

    useEffect(() => {
        const loadResults = async () => {
            setLoading(true)
            await getLeadingCandidates()

            setLoading(false)
        }

        loadResults()
    }, [])

    const getLeadingCandidates = async () => {
        const response = await fetch(
            'http://localhost:3333/api/candidate?page=1&perPage=12&withVotes=1&sortBy=desc'
        )
        if (response.ok) {
            const jsonData = await response.json()
            const candidates = jsonData.data
            setLeadingCandidates(candidates)
        }

        setCandidates([])
    }

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

            <Card className="shadow-md">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Leading 12 Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {leadingCandidates.map(
                                (candidate: Candidate, index) => (
                                    <div
                                        key={candidate.code}
                                        className="flex items-start gap-3 p-3 border rounded-md bg-white space-y-4"
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
                                        <div className="flex items-center gap-2 flex-1">
                                            <CandidateAvatar
                                                candidate={candidate}
                                            />
                                            <div>
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

                                                <div>
                                                    votes progress and count
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>All Candidates</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search candidate"
                                className="pl-8 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="border-4 border-gray-300 border-t-gray-600 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : (
                        <Tabs defaultValue="votes" className="w-full">
                            <div className="px-4">
                                <TabsList className="h-12">
                                    <TabsTrigger value="votes">
                                        Sort by Votes
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="votes" className="p-0">
                                <div className="p-4 space-y-2">
                                    {candidates.map((candidate, index) => (
                                        <div
                                            key={candidate.code}
                                            className="flex items-center gap-3 p-3 border rounded-md bg-white"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <CandidateAvatar
                                                        candidate={candidate}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                        <div>
                                                            <p className="font-medium">
                                                                {candidate.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                (
                                                                {
                                                                    candidate.party
                                                                }
                                                                )
                                                            </p>
                                                        </div>
                                                        <div className="text-lg font-bold text-green-700">
                                                            {candidate?.votes?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    {candidate?.votes && (
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full"
                                                                    style={{
                                                                        width: `${(candidate.votes / 1000) * 100}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
