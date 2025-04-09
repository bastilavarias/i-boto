/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const VoteController = () => import('#controllers/vote_controller')
const CandidateController = () => import('#controllers/candidate_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/set-token', [AuthController, 'setToken'])
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [CandidateController, 'index'])
      })
      .prefix('/candidate')

    router
      .group(() => {
        router.post('/', [VoteController, 'create'])
      })
      .use([middleware.firebaseAuth()])
      .prefix('/vote')
  })
  .prefix('/api')
