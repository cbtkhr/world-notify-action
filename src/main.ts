import * as core from '@actions/core'
import got from 'got'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})
    const participationId = core.getInput('participationId', {required: true})
    const content = core.getInput('content', {required: true})

    await got.post(
      `https://www.sonicgarden.world/room_api/v1/rooms/participations/${participationId}/comments?token=${token}`,
      {
        json: {
          comment: {content}
        },
        responseType: 'json'
      }
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
