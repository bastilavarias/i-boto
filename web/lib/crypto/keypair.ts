import { set, get } from 'idb-keyval'

const KEYPAIR_STORAGE_KEY = 'browser_keypair'

export type BrowserKeyPair = {
    publicKey: CryptoKey
    privateKey: CryptoKey
}

export async function initializeKeyPair(): Promise<BrowserKeyPair> {
    const existingKeyPair = await getKeyPair()
    if (existingKeyPair) {
        return existingKeyPair
    }

    const keyPair = await generateKeyPair()
    await storeKeyPair(keyPair)
    return keyPair
}

async function generateKeyPair(): Promise<BrowserKeyPair> {
    return await window.crypto.subtle.generateKey(
        {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
    )
}

async function storeKeyPair(keyPair: BrowserKeyPair): Promise<void> {
    await set(KEYPAIR_STORAGE_KEY, keyPair)
}

export async function getKeyPair(): Promise<BrowserKeyPair | undefined> {
    return await get<BrowserKeyPair>(KEYPAIR_STORAGE_KEY)
}
