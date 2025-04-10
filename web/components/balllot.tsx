'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { candidates } from '@/data'
import { Candidate } from '@/type'
import { useVoteStore } from '@/stores/useVoteStore'
import { CandidateAvatar } from '@/components/candidate-avatar'

interface BallotProps {
    isPublic?: boolean
}

const MAX_SELECTIONS = 12

export function Ballot({ isPublic = false }: BallotProps) {
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
    const [showWarning, setShowWarning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const voteStore = useVoteStore()

    const filteredCandidates = useMemo(() => {
        return candidates.filter((candidate) =>
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [candidates, searchTerm])

    const onSelectCandidate = (candidateCode: string) => {
        setSelectedCandidates((prev) => {
            if (prev.includes(candidateCode)) {
                return prev.filter((code) => code !== candidateCode)
            }

            if (prev.length < MAX_SELECTIONS) {
                return [...prev, candidateCode]
            }

            setShowWarning(true)
            return prev
        })
    }

    const submitVotes = async () => {
        if (selectedCandidates.length === 0 || selectedCandidates.length > 12) {
            throw new Error('Vote at least 1 - 12 candidate/s')
        }
        setIsSubmitting(true)
        const result = await voteStore.submit(selectedCandidates)
        if (result?.ok) {
            alert('Votes submitted!')
        } else {
            alert('Invalid vote!')
        }
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (showWarning) {
            const timer = setTimeout(() => {
                setShowWarning(false)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [showWarning])

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-7xl mx-auto shadow-lg bg-gray-50">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 md:w-20 md:h-20">
                                <Image
                                    src="/logo/republika-ng-pilipinas.png"
                                    alt="Philippine Coat of Arms"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-lg md:text-xl font-bold">
                                    LOCAL AND BARMM PARLIAMENTARY ELECTIONS
                                </h1>
                                <p className="text-sm md:text-base">
                                    SENATOR MOCK ELECTION BALLOT
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="mt-4 p-4 bg-white border rounded-md">
                        <h2 className="font-semibold text-lg mb-2">
                            INSTRUCTIONS FOR VOTING
                        </h2>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Select the card of your desired candidate.</li>
                            <li>You can select up to 12 senators only.</li>
                            <li>
                                Review your choices before submitting your
                                ballot.
                            </li>
                        </ol>
                    </div>
                </CardContent>

                <CardContent className="">
                    <div className="bg-green-100 p-4 rounded-md mb-6 text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-green-800">
                            Senatorial Candidates
                        </h2>
                        <p className="text-green-700 font-medium">
                            (BUMOTO NG HINDI HIHIGIT SA 12)
                        </p>
                        <div className="mt-2 text-sm bg-white p-2 rounded border border-green-200">
                            Selected: {selectedCandidates.length} of{' '}
                            {MAX_SELECTIONS}
                        </div>
                    </div>

                    {/* Search and Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
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

                    {showWarning && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                You can only select up to 12 candidates. Please
                                deselect a candidate before selecting a new one.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredCandidates.map((candidate) => (
                            <div
                                key={candidate.code}
                                className={`flex items-center gap-3 p-3 h-32 border rounded-md cursor-pointer ${
                                    selectedCandidates.includes(candidate.code)
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-white'
                                }`}
                                onClick={() =>
                                    onSelectCandidate(candidate.code)
                                }
                            >
                                <Checkbox
                                    id={`candidate-checkbox-${candidate.code}`}
                                    checked={selectedCandidates.includes(
                                        candidate.code
                                    )}
                                    onCheckedChange={() =>
                                        onSelectCandidate(candidate.code)
                                    }
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div>
                                        <label
                                            htmlFor={`candidate-checkbox-${candidate.placement}`}
                                            className="font-medium cursor-pointer"
                                        >
                                            {candidate.placement}.{' '}
                                            {candidate.name}
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            ({candidate.party})
                                        </p>
                                    </div>
                                </div>
                                <CandidateAvatar candidate={candidate} />
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="justify-center">
                    {!isPublic && (
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                onClick={submitVotes}
                                disabled={
                                    selectedCandidates.length === 0 ||
                                    isSubmitting
                                }
                                className="px-8"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Ballot'
                                )}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
