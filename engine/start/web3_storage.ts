import { create, Client } from '@web3-storage/w3up-client'
import env from '#start/env'

let web3StorageClient: Client = await create()
const email = env.get('WEB3_STORAGE_EMAIL') as `${string}@${string}`

if (!Object.keys(web3StorageClient.accounts()).length) {
  console.log('Logging to your Web3.storage Account...')
  console.log('Waiting for your email confirmation...')
  await web3StorageClient.login(email)
  console.log('Client successfully linked to your account...')
  const spaces = web3StorageClient.spaces()
  if (spaces.length) {
    await web3StorageClient.setCurrentSpace(spaces[0].did())
    console.log('Space provided!')
  }
} else {
  const spaces = web3StorageClient.spaces()
  if (spaces.length) {
    await web3StorageClient.setCurrentSpace(spaces[0].did())
  }
}

export default web3StorageClient
