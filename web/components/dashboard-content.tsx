'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Vote, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { User } from 'firebase/auth'

export function DashboardContent() {
    const { user, logout } = useAuth()

    const [totalVotes] = useState(0)
    const [authUser, setAuthUser] = useState<User | null>(null)

    const alreadyVoted = useMemo(() => {
        const candidates =
            JSON.parse(localStorage.getItem('candidates') as string) || []

        return candidates.length
    }, [localStorage])

    useEffect(() => {
        if (user) {
            setAuthUser(Object.assign(user))
        }
    }, [user])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                {authUser && (
                    <p className="text-gray-500">
                        Welcome {authUser?.displayName},{' '}
                        <span
                            className="underline cursor-pointer"
                            onClick={logout}
                        >
                            Logout
                        </span>
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Voting Status
                        </CardTitle>
                        <Vote className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alreadyVoted ? 'Completed' : 'Not Voted'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {alreadyVoted
                                ? 'You have submitted your ballot'
                                : "You haven't cast your vote yet"}
                        </p>
                        <div className="mt-4">
                            <Button
                                asChild
                                variant={alreadyVoted ? 'outline' : 'default'}
                            >
                                <Link
                                    href={
                                        alreadyVoted
                                            ? '/dashboard/receipt'
                                            : '/dashboard/vote'
                                    }
                                >
                                    {alreadyVoted
                                        ? 'View Your Receipt'
                                        : 'Vote Now'}
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
                                <Link href="/dashboard/results">
                                    View Results
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
