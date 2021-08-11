import * as core from '@actions/core'
import got from 'got'

function splitIds(ids: string): string[] {
  return ids.split(',').map(id => id.trim())
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true})

    const participationIdInput = core.getInput('participationId')
    const groupIdInput = core.getInput('groupId')
    if (!participationIdInput && !groupIdInput) {
      throw new Error(`participationId or groupId must be set`)
    }
    const participationIds = splitIds(participationIdInput)
    const groupIds = splitIds(groupIdInput)

    const content = core.getInput('content', {required: true})

    const apiUrlBase = 'https://www.sonicgarden.world/room_api/v1'

    const participationRequests = participationIds.map(participationId =>
      got.post(
        `${apiUrlBase}/rooms/participations/${participationId}/comments?token=${token}`,
        {
          json: {
            comment: {content}
          },
          responseType: 'json'
        }
      )
    )
    const groupRequests = groupIds.map(groupId =>
      got.post(`${apiUrlBase}/groups/${groupId}/entries?token=${token}`, {
        json: {
          entry: {content}
        },
        responseType: 'json'
      })
    )

    await Promise.all([...participationRequests, ...groupRequests])
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
