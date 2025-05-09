import path from 'node:path'
import { google } from 'googleapis'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)

let oAuth2Client = null

try {
  const CREDENTIALS_PATH = path.resolve(__dirname, '../ytvu-client-secret.json')
  const TOKEN_PATH = path.resolve(__dirname, '../ytvu-refresh-token.json')

  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'))
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { client_id, client_secret, redirect_uris } = credentials.web

  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'))
    oAuth2Client.setCredentials(token)
  }

  if (oAuth2Client.credentials.refresh_token) {
    const newToken = await oAuth2Client.refreshAccessToken()
    oAuth2Client.setCredentials(newToken.credentials)
    writeFileSync(TOKEN_PATH, JSON.stringify(newToken.credentials))
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const code: string = await new Promise((resolve) =>
      rl.question('Enter the code from that page here: ', (ans) => {
        rl.close()
        resolve(ans)
      })
    )

    const { tokens } = await oAuth2Client.getToken(code)
    oAuth2Client.setCredentials(tokens)
    writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
  }
} catch (e) {
  oAuth2Client = null
}

export default oAuth2Client
