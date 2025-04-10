import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import VoteController from '#controllers/vote_controller'
import { inject } from '@adonisjs/core'

export default class VoteBatchCount extends BaseCommand {
  static commandName = 'vote:batch-count'
  static description = 'Count batched votes.'

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(voteController: VoteController) {
    try {
      await voteController.batchCount()
    } catch (error) {
      this.logger.error('Error during vote counting: ' + error.message)
    }
  }
}
