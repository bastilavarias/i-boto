import { create } from 'zustand'

type VoteState = {
    vote: () => void
}

export const useVoteStore = create<VoteState>(() => ({
    vote: async () => {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'RSASSA-PKCS1-v1_5',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256',
            },
            true,
            ['sign', 'verify']
        )
        const votePayload = {
            candidates: ['AQUINOBAM2025'],
        }
        const encoded = new TextEncoder().encode(JSON.stringify(votePayload))
        const signature = await window.crypto.subtle.sign(
            {
                name: 'RSASSA-PKCS1-v1_5',
            },
            keyPair.privateKey,
            encoded
        )
        const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
        const exportedPubKey = await window.crypto.subtle.exportKey(
            'spki',
            keyPair.publicKey
        )

        const pubKeyBase64 = btoa(
            String.fromCharCode(...new Uint8Array(exportedPubKey))
        )

        await fetch('http://localhost:3333/api/vote/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vote: votePayload,
                sig,
                pubKey: pubKeyBase64,
            }),
            credentials: 'include',
        })
    },
}))
