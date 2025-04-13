'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VoteReceipt } from '@/components/vote-receipt'

export function DashboardReceiptContent() {
    const [candidateCodes, setCandidateCodes] = useState([])
    const router = useRouter()

    useEffect(() => {
        const localCandidates =
            JSON.parse(localStorage.getItem('candidates') as string) || []
        if (!localCandidates.length) router.push('/dashboard')
        setCandidateCodes(localCandidates)
    }, [])

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3">Preview</h2>
            <div className="border-2 border-dashed p-4 rounded-lg overflow-x-auto">
                <VoteReceipt codes={candidateCodes} />
            </div>
        </div>
    )
}
