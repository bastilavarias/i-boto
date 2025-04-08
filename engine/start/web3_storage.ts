import { create, Client } from '@web3-storage/w3up-client'
import env from '#start/env'

let web3StorageClient: Client = await create()
const email = env.get('WEB3_STORAGE_EMAIL') as `${string}@${string}`
const spaceName = env.get('WEB3_STORAGE_SPACE') as string

if (!Object.keys(web3StorageClient.accounts()).length) {
  const account = await web3StorageClient.login(email)
  const space = await web3StorageClient.createSpace(spaceName)
  await space.save()
  await account.provision(space.did())
} else {
  const spaces = web3StorageClient.spaces()
  if (spaces.length) {
    await web3StorageClient.setCurrentSpace(spaces[0].did())
  }
}

export default web3StorageClient
