import { inject } from '@adonisjs/core'
import path from 'node:path'
import { existsSync, createReadStream } from 'node:fs'
import Candidate from '#models/candidate'
import sharp from 'sharp'
import env from '#start/env'
import CryptographyService from '#services/cryptography_service'
import { google } from 'googleapis'
import oAuth2Client from '#start/google_client'

@inject()
export default class ThumbnailController {
  constructor(private cryptographyService: CryptographyService) {}

  public async generateUpload() {
    try {
      await this.generate()
      await this.upload()
    } catch (error) {
      console.error('Generate upload error:', error)
    }
  }

  private async generate() {
    try {
      const backgroundPath = path.resolve(
        import.meta.dirname,
        '../../assets/images/thumbnail-base.jpg'
      )
      if (!existsSync(backgroundPath)) {
        console.error('Missing background.')
        process.exit(1)
      }

      const candidatesQuery = Candidate.query()
      candidatesQuery
        .select(['id', 'code'])
        .withCount('voteTallies')
        .withCount('voteTallies')
        .preload('voteTallies')
        .orderBy('voteTallies_count', 'desc')
      const candidates = await candidatesQuery.paginate(1, 12)
      const filteredCandidates = candidates.all().map((candidate) => {
        const filteredVotes = candidate.voteTallies.filter((vote) => {
          return this.cryptographyService.verifyLocalSignature(
            env.get('VOTE_TALLY_SIGNATURE_DATA'),
            vote.signature
          )
        })
        const serialized = candidate.serialize()
        delete serialized.voteTallies
        const voteSum = filteredVotes.reduce((sum, vote) => sum + vote.vote, 0)

        return {
          ...serialized,
          votes: voteSum,
        }
      })
      const tiles = []
      const containerX = 2235
      let containerY = 0
      const imageWidth = 588
      const imageHeight = 565
      let paddingX = 0
      let paddingY = 0
      // @ts-ignore
      for (const [index, candidate] of filteredCandidates.entries()) {
        const breakpoint = index
        if (breakpoint === 3 || breakpoint === 6 || breakpoint === 9 || breakpoint === 12) {
          containerY += imageHeight
          paddingX = 0
        }
        const image = path.resolve(
          import.meta.dirname,
          //@ts-ignore
          `../../assets/images/candidates/2025/senate/${candidate.code}.png`
        )
        tiles.push({
          input: await sharp(image)
            .resize({
              width: imageWidth,
              height: imageHeight,
            })
            .toBuffer(),
          top: containerY,
          left: containerX + paddingX,
        })
        paddingX += imageWidth
        paddingY += imageHeight
      }
      const outputPath = path.resolve(import.meta.dirname, '../../assets/images/thumbnail.jpg')
      await sharp(backgroundPath).composite(tiles).jpeg({ quality: 98 }).toFile(outputPath)

      console.log('Image composited successfully.')
    } catch (error) {
      console.error('Generate thumbnail error:', error)
    }
  }

  private async upload() {
    try {
      // @ts-ignore
      const authClient = oAuth2Client
      const youtube = google.youtube({ version: 'v3', auth: authClient })

      const youtubeVideoID = env.get('YOUTUBE_VIDEO_ID')
      await youtube.thumbnails.set({
        videoId: youtubeVideoID,
        media: {
          body: createReadStream(path.join('assets', 'images', 'thumbnail.jpg')),
        },
      })

      console.log('Thumbnail uploaded successfully.')
    } catch (error) {
      console.error('Upload error:', error)
    }
  }
}
