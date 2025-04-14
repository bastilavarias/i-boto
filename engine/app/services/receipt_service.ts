import puppeteer, { Browser, Page } from 'puppeteer'
import env from '#start/env'

export default class ScreenshotService {
  private browser: Browser | null = null
  private page: Page | null = null

  public async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: {
        width: 1920,
        height: 1920,
        deviceScaleFactor: 1,
      },
    })
    this.page = await this.browser.newPage()
  }

  public async generate(codes: string[]): Promise<string> {
    if (!this.page) {
      await this.initialize()
    }
    const url = new URL(`${env.get('WEB_CLIENT_DOMAIN')}/receipt-template`)
    url.searchParams.append('codes', codes.join(','))
    await this.page!.goto(url.toString(), {
      waitUntil: 'networkidle0',
    })
    await this.page!.waitForSelector(env.get('RECEIPT_TEMPLATE_SELECTOR'))
    const element = await this.page!.$(env.get('RECEIPT_TEMPLATE_SELECTOR'))
    if (!element) {
      throw new Error(`Selector ${env.get('RECEIPT_TEMPLATE_SELECTOR')} not found`)
    }

    return await element.screenshot({
      omitBackground: true,
      encoding: 'base64',
    })
  }

  public async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
    }
  }
}
