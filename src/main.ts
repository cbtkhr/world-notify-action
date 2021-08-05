import * as core from '@actions/core'
import got from 'got'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})

    const participationIdInput = core.getInput('participationId')
    const groupIdInput = core.getInput('groupId')
    if (!participationIdInput && !groupIdInput) {
      throw new Error(`participationId or groupId must be set`)
    }
    const participationIds = participationIdInput
      .split(',')
      .map(id => id.trim())
    const groupIds = groupIdInput.split(',').map(id => id.trim())

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
    requests.push(
      ...groupIds.map(groupId =>
        got.post(
          `https://www.sonicgarden.world/room_api/v1/groups/${groupId}/entries.json?token=${token}`,
          {
            form: {
              'entry[content]': content
            }
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
