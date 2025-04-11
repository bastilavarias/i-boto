'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { candidates } from '@/data'
import { useVoteStore } from '@/stores/useVoteStore'
import { CandidateAvatar } from '@/components/candidate-avatar'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ReceiptContent } from '@/components/receipt-content'

interface BallotProps {
    isPublic?: boolean
}

const MAX_SELECTIONS = 12

export function Ballot({ isPublic = false }: BallotProps) {
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
    const [showWarning, setShowWarning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isReceiptDialog, setIsReceiptDialog] = useState(false)

    const voteStore = useVoteStore()

    const SubmitButton = () => {
        return (
            <Button
                size="lg"
                onClick={submitVotes}
                disabled={
                    selectedCandidates.length === 0 ||
                    selectedCandidates.length > 12 ||
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
        )
    }

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
        setIsReceiptDialog(true)
        // const result = await voteStore.submit(selectedCandidates)
        // if (result?.ok) {
        //     toast.success('Congratulations! Your ballot successfully recorded.')
        // } else {
        //     toast.error('Vote submission failed. Please try again later.')
        // }
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (showWarning) {
            toast.warning('You can only select up to 12 candidates.')
            setShowWarning(false)
        }
    }, [showWarning])

    return (
        <div className="space-y-6">
            <Card className="w-full mx-auto">
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
            </Card>

            <div className="space-y-4">
                <Card className="sticky left-0 top-[6.5%] z-10 rounded-none shadow-none pt-0">
                    <div className="bg-green-100 text-center p-2 flex-col justify-between">
                        <div className="" />
                        <p className="font-bold text-green-800">
                            Senatorial Candidates (BUMOTO NG HINDI HIHIGIT SA
                            12)
                        </p>
                        <p className="font-medium text-green-800">
                            Selected: {selectedCandidates.length} {' out of '}
                            {MAX_SELECTIONS}
                        </p>
                    </div>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-2">
                            <CardTitle>All Candidates</CardTitle>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search candidate"
                                    className="pl-8 w-full sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <SubmitButton />
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCandidates.map((candidate) => (
                        <div
                            key={candidate.code}
                            className={`flex items-center gap-3 p-3 h-32 border rounded-md cursor-pointer ${
                                selectedCandidates.includes(candidate.code)
                                    ? 'bg-green-50 border-green-300'
                                    : 'bg-white'
                            }`}
                            onClick={() => onSelectCandidate(candidate.code)}
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
                                        {candidate.placement}. {candidate.name}
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

                <div className="justify-center">
                    {!isPublic && (
                        <div className="w-full py-6 flex justify-center">
                            <SubmitButton />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isReceiptDialog} onOpenChange={setIsReceiptDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ReceiptContent />
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
