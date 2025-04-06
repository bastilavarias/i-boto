'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Ballot } from '@/components/balllot';

export function HomeContent() {
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const storedVotes = localStorage.getItem('mockElectionVotes');
        if (storedVotes) {
            setHasVoted(true);
        }
    }, []);

    return (
        <div className="space-y-6">
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                    This is a public preview of the mock election. You can view
                    the ballot and current results, but voting is disabled in
                    this mode.
                </AlertDescription>
            </Alert>

            {hasVoted && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-2">
                            <div className="bg-green-100 p-2 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-green-600"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-green-800">
                                    You have already voted
                                </h3>
                                <p className="text-green-700 mt-1">
                                    Thank you for participating in our mock
                                    election. You can view the{' '}
                                    <Link
                                        href="/results"
                                        className="font-medium underline"
                                    >
                                        current results
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Ballot isPublic={true} />
        </div>
    );
}
