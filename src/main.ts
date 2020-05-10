import * as core from '@actions/core'
import got from 'got'

async function run(): Promise<void> {
  try {
    const worldToken = core.getInput('worldToken', {required: true})
    const participationId = core.getInput('participationId', {required: true})
    const content = core.getInput('content', {required: true})

    await got.post(
      `https://www.sonicgarden.world/api/v1/rooms/participations/${participationId}/comments.json`,
      {
        json: {
          comment: {content}
        },
        headers: {
          Authorization: `Bearer ${worldToken}`
        },
        responseType: 'json'
      }
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
