import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ReceiptService from '#services/receipt_service'

@inject()
export default class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  public async generate({ request, response }: HttpContext) {
    const { codes } = request.only(['codes'])

    try {
      const base64image = await this.receiptService.generate(codes)

      return response.status(200).send({
        message: 'Personal Ballot generated successfully',
        data: {
          image: base64image,
          mimeType: 'image/png',
        },
      })
    } catch (error) {
      console.error(error.message)
      return response.status(401).send({ error: 'Something went wrong. Please try again.' })
    }
  }
}
