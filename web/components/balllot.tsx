'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { candidates } from '@/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface BallotProps {
    isPublic?: boolean;
}

export function Ballot({ isPublic = false }: BallotProps) {
    const router = useRouter();
    const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
    const [showWarning, setShowWarning] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MAX_SELECTIONS = 12;

    useEffect(() => {
        const storedVotes = localStorage.getItem('mockElectionVotes');
        if (storedVotes) {
            setSelectedCandidates(JSON.parse(storedVotes));
            setHasVoted(true);
        }
    }, []);

    const handleCandidateSelect = (candidateId: number) => {
        if (hasVoted) return;

        setSelectedCandidates((prev) => {
            if (prev.includes(candidateId)) {
                return prev.filter((id) => id !== candidateId);
            }

            if (prev.length < MAX_SELECTIONS) {
                return [...prev, candidateId];
            }

            setShowWarning(true);
            return prev;
        });
    };

    useEffect(() => {
        if (showWarning) {
            const timer = setTimeout(() => {
                setShowWarning(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showWarning]);

    const handleSubmit = () => {
        if (hasVoted || selectedCandidates.length === 0) return;

        setIsSubmitting(true);

        localStorage.setItem(
            'mockElectionVotes',
            JSON.stringify(selectedCandidates)
        );

        const existingResults = localStorage.getItem('mockElectionResults');
        const results = existingResults ? JSON.parse(existingResults) : {};

        selectedCandidates.forEach((id) => {
            results[id] = (results[id] || 0) + 1;
        });

        results.lastUpdated = new Date().toISOString();

        localStorage.setItem('mockElectionResults', JSON.stringify(results));

        setTimeout(() => {
            setHasVoted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    if (hasVoted) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="text-center bg-green-50 border-b">
                        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-2" />
                        <CardTitle className="text-2xl text-green-700">
                            Your Vote Has Been Recorded
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-4">
                            You have selected the following candidates:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {selectedCandidates.map((id) => {
                                const candidate = candidates.find(
                                    (c) => c.id === id
                                );
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-3 p-3 border rounded-md bg-gray-50"
                                    >
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                            <Image
                                                src={`/placeholder.svg?height=40&width=40&text=${id}`}
                                                alt={candidate?.name || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {candidate?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ({candidate?.party})
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {isPublic ? (
                                <Button onClick={() => router.push('/results')}>
                                    View Results
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            router.push('/dashboard')
                                        }
                                    >
                                        Return to Dashboard
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            router.push('/dashboard/results')
                                        }
                                    >
                                        View Results
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
            </Card>

            <Card className="pt-0">
                <CardContent className="p-4 md:p-6">
                    <div className="bg-green-50 p-4 rounded-md mb-6 text-center">
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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <CardTitle>All Candidates</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search candidate"
                                className="pl-8 w-full sm:w-64"
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
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className={`flex items-center gap-3 p-3 h-32 border rounded-md ${
                                    selectedCandidates.includes(candidate.id)
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-white'
                                }`}
                                onClick={() =>
                                    handleCandidateSelect(candidate.id)
                                }
                            >
                                <Checkbox
                                    id={`candidate-mobile-${candidate.id}`}
                                    checked={selectedCandidates.includes(
                                        candidate.id
                                    )}
                                    onCheckedChange={() =>
                                        handleCandidateSelect(candidate.id)
                                    }
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div>
                                        <label
                                            htmlFor={`candidate-mobile-${candidate.id}`}
                                            className="font-medium cursor-pointer"
                                        >
                                            {candidate.id}. {candidate.name}
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            ({candidate.party})
                                        </p>
                                    </div>
                                </div>
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={candidate.image_url}
                                        alt={candidate.name}
                                    />
                                    <AvatarFallback>
                                        {candidate.name}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="justify-center">
                    {!isPublic && (
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                onClick={handleSubmit}
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
    );
}
