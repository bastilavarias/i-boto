import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ReceiptService from '#services/receipt_service'

@inject()
export default class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  public async generate({ request, response }: HttpContext) {
    const { url, selector } = request.only(['url', 'selector'])

    try {
      const buffer = await this.receiptService.generate(url, { selector })
      await this.receiptService.close()

      response.header('Content-Type', 'image/png')
      return response.send(buffer)
    } catch (error) {
      await this.receiptService.close()
      return response.status(500).send({ error: error.message })
    }
  }
}
