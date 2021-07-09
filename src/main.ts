import * as core from '@actions/core'
import got from 'got'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})
    const participationIds = core
      .getInput('participationId', {required: true})
      .split(',')
      .map(id => id.trim())
    const content = core.getInput('content', {required: true})

    const requests = participationIds.map(participationId =>
      got.post(
        `https://www.sonicgarden.world/room_api/v1/rooms/participations/${participationId}/comments?token=${token}`,
        {
          json: {
            comment: {content}
          },
          responseType: 'json'
        }
      )
    )
    await Promise.all(requests)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
