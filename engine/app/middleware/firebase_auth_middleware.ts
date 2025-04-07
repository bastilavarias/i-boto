import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { firebaseAuth } from '#start/firebase'

export default class FirebaseAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.cookie('session')

    if (!token) {
      return ctx.response.unauthorized({ message: 'No session token found' })
    }

    try {
      await firebaseAuth.verifyIdToken(token)
      await next()
    } catch (error) {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }
  }
}
