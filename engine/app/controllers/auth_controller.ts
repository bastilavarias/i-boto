import type { HttpContext } from '@adonisjs/core/http'
import { firebaseAuth } from '#start/firebase'
import env from '#start/env'

export default class AuthController {
  public async setToken({ request, response }: HttpContext) {
    try {
      const idToken = request.input('token')
      const decodedToken = await firebaseAuth.verifyIdToken(idToken)
      const uid = decodedToken.uid
      const isProd = env.get('NODE_ENV') === 'production'
      response.cookie('session', idToken, {
        httpOnly: true,
        sameSite: isProd ? 'none' : false,
        secure: isProd,
        maxAge: 60 * 60 * 24 * 5,
        path: '/',
        domain: isProd ? env.get('COOKIE_DOMAIN') : undefined, // if needed across subdomains
      })

      return response.json({
        message: 'Logged in',
        data: {
          uid,
        },
      })
    } catch (error) {
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
