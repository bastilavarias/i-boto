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
      const domain = isProd ? env.get('COOKIE_DOMAIN') : undefined
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60,
        path: '/',
      }
      console.log(isProd)
      if (isProd) {
        cookieOptions.secure = true
        cookieOptions.domain = domain
      }
      console.log(cookieOptions)
      response.cookie('session', idToken, cookieOptions)

      return response.json({
        message: 'Logged in',
        data: { uid },
      })
    } catch (error) {
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
