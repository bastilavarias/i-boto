import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
// @ts-ignore
import serviceAccount from '../firebasedev-sk.json'

initializeApp({
  credential: cert(serviceAccount as any),
})

export const firebaseAuth = getAuth()
