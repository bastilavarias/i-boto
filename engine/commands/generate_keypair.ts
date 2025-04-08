import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export default class GenerateKeypair extends BaseCommand {
  static commandName = 'generate:keypair'
  static description = 'Command for generating key pair for cryptographies.'

  static options: CommandOptions = {}

  async run() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })

    this.logger.info('Key pair generated')

    // Sanitize for .env (replace newlines and wrap in double quotes)
    const sanitize = (key: string) => JSON.stringify(key)

    this.upsertEnvVariable('PUBLIC_KEY', sanitize(publicKey))
    this.upsertEnvVariable('PRIVATE_KEY', sanitize(privateKey))

    this.logger.success('Keys added/updated in .env')
  }

  private upsertEnvVariable(key: string, value: string) {
    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    const exists = fs.existsSync(envPath)

    if (exists) {
      envContent = fs.readFileSync(envPath, 'utf-8')
      const regex = new RegExp(`^${key}=.*`, 'm')

      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`)
      } else {
        envContent += `\n${key}=${value}`
      }
    } else {
      envContent = `${key}=${value}`
    }

    fs.writeFileSync(envPath, envContent)
  }
}
