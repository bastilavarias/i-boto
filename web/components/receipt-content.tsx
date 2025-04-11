'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import { Button } from '@/components/ui/button'
import FontFaceObserver from 'fontfaceobserver'
import CandidatePick from '@/components/candidate-pick'

export function ReceiptContent() {
    const receiptComponent = useRef(null)

    const candidates = [
        {
            name: 'ABALOS, BENHUR',
            party: 'PFP',
            code: 'ABALOSBENHUR2025',
            placement: 1,
            votes: 0,
        },
        {
            name: 'ADONIS, JEROME',
            party: 'MKBYN',
            code: 'ADONISJEROME2025',
            placement: 2,
            votes: 0,
        },
        {
            name: 'AMAD, WILSON',
            party: 'IND',
            code: 'AMADWILSON2025',
            placement: 3,
            votes: 0,
        },
        {
            name: 'ANDAMO, NARS ALYN',
            party: 'MKBYN',
            code: 'ANDAMONARSALYN2025',
            placement: 4,
            votes: 0,
        },
        {
            name: 'AQUINO, BAM',
            party: 'KNP',
            code: 'AQUINOBAM2025',
            placement: 5,
            votes: 0,
        },
        {
            name: 'ARAMBULO, RONNEL',
            party: 'MKBYN',
            code: 'ARAMBULORONNEL2025',
            placement: 6,
            votes: 0,
        },
        {
            name: 'ARELLANO, ERNESTO',
            party: 'KTPNAN',
            code: 'ARELLANOERNESTO2025',
            placement: 7,
            votes: 0,
        },
        {
            name: 'BALLON, ROBERTO',
            party: 'IND',
            code: 'BALLONROBERTO2025',
            placement: 8,
            votes: 0,
        },
        {
            name: 'BINAY, ABBY',
            party: 'NPC',
            code: 'BINAYABBY2025',
            placement: 9,
            votes: 0,
        },
        {
            name: 'BONDOC, JIMMY',
            party: 'PDPLBN',
            code: 'BONDOCJIMMY2025',
            placement: 10,
            votes: 0,
        },
        {
            name: 'BORJA REVILLA, RAMON, JR.',
            party: 'LAKAS',
            code: 'BORJAREVILLARAMONJR2025',
            placement: 11,
            votes: 0,
        },
        {
            name: 'BOSITA, COLONEL',
            party: 'IND',
            code: 'BOSITACOLONEL2025',
            placement: 12,
            votes: 0,
        },
    ]

    const onDownload = async () => {
        if (receiptComponent.current) {
            try {
                const poppins = new FontFaceObserver('Poppins')
                await poppins.load()
                html2canvas(receiptComponent.current).then((canvas) => {
                    const image = canvas.toDataURL('image/png')
                    const link = document.createElement('a')
                    link.download = 'screenshot.png'
                    link.href = image
                    link.click()
                })
            } catch (error) {
                console.error('Font failed to load', error)
            }
        }
    }

    return (
        <div className="space-y-8">
            <CandidatePick
                candidates={candidates}
                title="BLUE THEME"
                subtitle="DEMOCRATIC CANDIDATES"
                hashtag="#Election2025"
                footer="BLUE.EXAMPLE.COM"
                primaryColor="#00008B"
                secondaryColor="#0055a5"
                accentColor="#000066"
            />

            <div
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                }}
            >
                <div ref={receiptComponent}>
                    <CandidatePick
                        candidates={candidates}
                        title="BLUE THEME"
                        subtitle="DEMOCRATIC CANDIDATES"
                        hashtag="#Election2025"
                        footer="BLUE.EXAMPLE.COM"
                        primaryColor="#00008B"
                        secondaryColor="#0055a5"
                        accentColor="#000066"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={onDownload}>Save Receipt</Button>
            </div>
        </div>
    )
}
