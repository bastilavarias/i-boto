import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import serviceAccount from '../firebasedev-sk.json' with { type: 'json' }

initializeApp({
  credential: cert(serviceAccount as any),
})

export const firebaseAuth = getAuth()
