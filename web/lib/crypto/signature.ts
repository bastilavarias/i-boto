import { getKeyPair } from '@/lib/crypto/keypair'

const keypair = await getKeyPair()
export const signData = async (data: object): Promise<string | null> => {
    if (keypair) {
        const encoded = new TextEncoder().encode(JSON.stringify(data))
        const signatureRaw = await window.crypto.subtle.sign(
            { name: 'RSASSA-PKCS1-v1_5' },
            keypair.privateKey,
            encoded
        )
        return btoa(String.fromCharCode(...new Uint8Array(signatureRaw)))
    }

    return null
}

export const exportPubKeyBase64 = async (): Promise<string | null> => {
    if (keypair) {
        const exportedPubKey = await window.crypto.subtle.exportKey(
            'spki',
            keypair.publicKey
        )

        return btoa(String.fromCharCode(...new Uint8Array(exportedPubKey)))
    }

    return null
}
