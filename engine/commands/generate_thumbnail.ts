import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import ThumbnailController from '#controllers/thumbnail_controller'
import { inject } from '@adonisjs/core'

export default class GenerateThumbnail extends BaseCommand {
  static commandName = 'generate:thumbnail'
  static description = 'Command for thumbnail generation.'

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(thumbnailController: ThumbnailController) {
    try {
      await thumbnailController.generate()
      console.log(`${GenerateThumbnail.commandName} is called`)
      this.logger.info(`${GenerateThumbnail.commandName} is called`)
    } catch (error) {
      this.logger.error('Error during thumbnail generation: ' + error.message)
      console.log('Error during thumbnail generation: ' + error.message)
    }
  }
}
