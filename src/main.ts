import * as core from '@actions/core'
import got from 'got'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})
    const participationIds = core
      .getInput('participationId')
      .split(',')
      .map(id => id.trim())
    const groupIds = core
      .getInput('groupId')
      .split(',')
      .map(id => id.trim())
    if (!participationIds.length && !groupIds.length) {
      throw new Error(`participationId or groupId must be set`)
    }
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
    requests.concat(
      groupIds.map(groupId =>
        got.post(
          `https://www.sonicgarden.world/room_api/v1/groups/${groupId}/entries.json?token=${token}`,
          {
            json: {
              entry: {
                content: {content}
              }
            },
            responseType: 'json'
          }
        )
      )
    )

    await Promise.all(requests)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
