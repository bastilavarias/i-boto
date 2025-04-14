'use client'

import { VoteReceipt } from '@/components/vote-receipt'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateReceiptRepository } from '@/lib/repository/receipt'
import { useState } from 'react'

export function DashboardReceiptContent() {
    const [isLoading, setIsLoading] = useState(false)
    const handleDownload = async () => {
        setIsLoading(true)
        const storedCodes = localStorage.getItem('candidates')
        if (storedCodes) {
            try {
                const parsedCodes = JSON.parse(storedCodes)
                if (Array.isArray(parsedCodes)) {
                    const result = await generateReceiptRepository(parsedCodes)
                    if (result?.success) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-expect-error
                        const image = result?.data?.data || null
                        if (!image) {
                            throw new Error('Invalid receipt data.')
                        }

                        const link = document.createElement('a')
                        link.href = `data:${image.mimeType};base64,${image.image}`
                        link.download = 'iboto-voting-receipt.png' // Set filename
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)

                        toast.success(
                            'Receipt successfully generated. It will automatically downloaded in your device.'
                        )
                        setIsLoading(false)
                        return
                    } else {
                        toast.error(
                            result.message ||
                                'Receipt download failed. Please try again later.'
                        )
                    }
                }
            } catch (error) {
                toast.error(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    error.message ||
                        'Receipt download failed. Please try again later.'
                )
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="mb-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-3">Preview</h2>
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className=" animate-spin" />
                    ) : (
                        <Download />
                    )}{' '}
                    Download
                </Button>
            </div>
            <div className="border-2 border-dashed p-4 rounded-lg overflow-x-auto">
                <VoteReceipt dataFrom="storage" />
            </div>
        </div>
    )
}
