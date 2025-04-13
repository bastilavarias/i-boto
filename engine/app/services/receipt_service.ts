import puppeteer, { Browser, Page, ScreenshotOptions } from 'puppeteer'

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

  public async generate(
    url: string,
    options: {
      selector?: string
      outputPath?: string
      screenshotOptions?: ScreenshotOptions
    } = {}
  ): Promise<Uint8Array<ArrayBufferLike>> {
    if (!this.page) {
      await this.initialize()
    }
    await this.page!.goto(url, { waitUntil: 'networkidle0' })
    if (options.selector) {
      await this.page!.waitForSelector(options.selector)
      const element = await this.page!.$(options.selector)
      if (!element) {
        throw new Error(`Selector ${options.selector} not found`)
      }

      return await element.screenshot({
        path: options.outputPath,
        omitBackground: true,
        ...options.screenshotOptions,
      })
    }

    const screenshot = await this.page!.screenshot({
      path: options.outputPath,
      fullPage: true,
      ...options.screenshotOptions,
    })

    return screenshot
  }

  public async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
    }
  }
}
