import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import VoteController from '#controllers/vote_controller'

export default class VoteProcess extends BaseCommand {
  static commandName = 'vote:process'
  static description = 'Process vote command.'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      const voteController = new VoteController()
      await voteController.process()
    } catch (error) {
      this.logger.error('Error during vote processing: ' + error.message)
    }
  }
}
