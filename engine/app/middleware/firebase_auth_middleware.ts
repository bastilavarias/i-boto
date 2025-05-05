import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { firebaseAuth } from '#start/firebase'

export default class FirebaseAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const cookie = ctx.request.cookie('session')

    if (!cookie) {
      return ctx.response.unauthorized({ message: 'No session token found' })
    }

    try {
      const firebaseUser = await firebaseAuth.verifyIdToken(cookie)
      //@ts-ignore
      ctx.request.user = firebaseUser.email

      await next()
    } catch (error) {
      console.error('Firebase token verification error:', error.message)

      // Match Firebase error
      if (error.code === 'auth/id-token-expired') {
        return ctx.response.unauthorized({
          message: 'Session expired. Please refresh and try again.',
        })
      }

      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }
  }
}
