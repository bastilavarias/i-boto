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
const ReceiptController = () => import('#controllers/receipt_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/set-token', [AuthController, 'setToken'])
        router.get('/logout', [AuthController, 'logout'])
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [CandidateController, 'index'])
      })
      .prefix('/candidate')

    router
      .group(() => {
        router.post('/', [VoteController, 'create']).use([middleware.firebaseAuth()])
        router.get('/total', [VoteController, 'countTotalVotes'])
      })

      .prefix('/vote')

    router
      .group(() => {
        router.post('/', [ReceiptController, 'generate']).use([middleware.firebaseAuth()])
      })
      .prefix('/receipt')
  })
  .prefix('/api')
