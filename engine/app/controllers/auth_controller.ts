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

const isProd = env.get('NODE_ENV') === 'production'
const cookieOptions: CustomCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'None' : false,
  maxAge: 60 * 60, // 1hr same in firebase token
  path: '/',
}

export default class AuthController {
  public async setToken({ request, response }: HttpContext) {
    try {
      const idToken = request.input('token')
      const decodedToken = await firebaseAuth.verifyIdToken(idToken)
      const uid = decodedToken.uid
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

  public async logout({ response }: HttpContext) {
    // @ts-ignore
    response.clearCookie('session', cookieOptions)

    return response.ok({ message: 'Logged out successfully' })
  }
}
