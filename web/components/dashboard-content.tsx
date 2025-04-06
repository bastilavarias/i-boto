'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Vote, BarChart3, Users } from 'lucide-react'

export function DashboardContent() {
    const [hasVoted, setHasVoted] = useState(false)
    const [totalVotes, setTotalVotes] = useState(0)
    const [voterParticipation, setVoterParticipation] = useState(0)

    useEffect(() => {
        // Check if user has voted
        const userVotes = localStorage.getItem('mockElectionVotes')
        setHasVoted(!!userVotes)

        // Get total votes
        const allVotes = localStorage.getItem('mockElectionResults')
        if (allVotes) {
            const votesData = JSON.parse(allVotes)
            const total = Object.values(votesData).reduce(
                (sum: number, count: any) => sum + count,
                0
            )
            setTotalVotes(total)

            // Simulate voter participation (random between 60-85%)
            setVoterParticipation(Math.floor(Math.random() * 25) + 60)
        }
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">
                    Welcome to the iBoto Senatorial 2025 Election
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Voting Status
                        </CardTitle>
                        <Vote className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {hasVoted ? 'Completed' : 'Not Voted'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {hasVoted
                                ? 'You have submitted your ballot'
                                : "You haven't cast your vote yet"}
                        </p>
                        <div className="mt-4">
                            <Button
                                asChild
                                variant={hasVoted ? 'outline' : 'default'}
                            >
                                <Link href="/dashboard/vote">
                                    {hasVoted ? 'View Your Ballot' : 'Vote Now'}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Votes Cast
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalVotes.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Across all candidates
                        </p>
                        <div className="mt-4">
                            <Button asChild variant="outline">
                                <Link href="/results">View Results</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Voter Participation
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {voterParticipation}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Of registered voters
                        </p>
                        <div className="mt-4">
                            <Progress
                                value={voterParticipation}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>How to Vote</CardTitle>
                        <CardDescription>
                            Follow these steps to cast your vote in the mock
                            election
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Navigate to the Vote page using the sidebar</li>
                            <li>Select up to 12 senatorial candidates</li>
                            <li>Review your selections carefully</li>
                            <li>Submit your ballot to record your vote</li>
                            <li>
                                View the results page to see the current
                                standings
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>About This Election</CardTitle>
                        <CardDescription>
                            Information about the mock senatorial election
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            This is a simulation of the May 12, 2025 National,
                            Local and BARMM Parliamentary Elections.
                        </p>
                        <p>
                            The mock election allows you to select up to 12
                            senatorial candidates from a list of 66 candidates.
                        </p>
                        <p>
                            All data is stored locally in your browser and is
                            for demonstration purposes only.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
