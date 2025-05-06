import type { HttpContext } from '@adonisjs/core/http'
import { firebaseAuth } from '#start/firebase'
import env from '#start/env'

interface CustomCookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: string | false
  maxAge: number
  path: string
}

export default class AuthController {
  public async setToken({ request, response }: HttpContext) {
    try {
      const idToken = request.input('token')
      const decodedToken = await firebaseAuth.verifyIdToken(idToken)
      const uid = decodedToken.uid
      const isProd = env.get('NODE_ENV') === 'production'
      const cookieOptions: CustomCookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : false,
        maxAge: 60 * 60,
        path: '/',
      }
      if (isProd) {
        cookieOptions.secure = true
      }
      // @ts-ignore
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
