import puppeteer from 'puppeteer'
import { createPool } from 'generic-pool'
import env from '#start/env'

export default class ScreenshotService {
  private static browserPool = createPool(
    {
      create: async () => {
        return puppeteer.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Critical for Docker
            '--single-process', // Reduces memory usage
          ],
          defaultViewport: {
            width: 1920,
            height: 1920,
            deviceScaleFactor: 1,
          },
        })
      },
      destroy: (browser) => browser.close(),
    },
    {
      max: 5, // Adjust based on server memory (1GB per instance)
      min: 1,
      idleTimeoutMillis: 30000,
    }
  )

  public async generate(codes: string[]): Promise<string> {
    const browser = await ScreenshotService.browserPool.acquire()
    const page = await browser.newPage()

    try {
      const url = new URL(`${env.get('WEB_CLIENT_DOMAIN')}/receipt-template`)
      url.searchParams.append('codes', codes.join(','))

      await page.goto(url.toString(), {
        waitUntil: 'networkidle0',
        timeout: 15000, // Fail fast
      })

      const selector = env.get('RECEIPT_TEMPLATE_SELECTOR')
      await page.waitForSelector(selector, { timeout: 5000 })
      const element = await page.$(env.get('RECEIPT_TEMPLATE_SELECTOR'))
      if (!element) {
        throw new Error(`Selector ${env.get('RECEIPT_TEMPLATE_SELECTOR')} not found`)
      }

      return await element.screenshot({
        omitBackground: true,
        encoding: 'base64',
      })
    } finally {
      console.log('im released')
      await page.close()
      await ScreenshotService.browserPool.release(browser)
    }
  }
}
