import type { HttpContext } from '@adonisjs/core/http'
import { firebaseAuth } from '#start/firebase'

export default class AuthController {
  public async setToken({ request, response }: HttpContext) {
    try {
      const idToken = request.input('token')
      const decodedToken = await firebaseAuth.verifyIdToken(idToken)
      const uid = decodedToken.uid
      response.cookie('session', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 5,
        path: '/',
        sameSite: 'lax',
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

  public async logout({ response }: HttpContext) {
    response.clearCookie('session')
    return response.ok({ message: 'Logged out' })
  }
}
