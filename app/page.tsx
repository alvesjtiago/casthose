'use client'

import { useEffect, useState } from 'react'
import {
  getHubRpcClient,
  HubEventType,
  HubEvent,
  bytesToHexString,
} from '@farcaster/hub-web'

interface Cast {
  hash?: Uint8Array
  fid: number
  username: string
  displayName: string
  avatarUrl: string
  text: string
}

export default function Home() {
  const [casts, setCasts] = useState<Cast[]>([])

  const getStream = async () => {
    const nodeClient = getHubRpcClient(
      'https://622393.hubs-web.neynar.com:2285',
      {},
    )

    const result = nodeClient.subscribe({
      eventTypes: [HubEventType.MERGE_MESSAGE],
    })

    let allCasts = casts
    result.map((observable) => {
      observable.subscribe({
        async next(event: HubEvent) {
          console.log('received event', event)
          const message =
            event?.mergeMessageBody?.message?.data?.castAddBody?.text
          if (message) {
            const userResponse = await (
              await fetch(
                '/api/users/' + event?.mergeMessageBody?.message?.data?.fid,
              )
            ).json()
            const user = userResponse?.result?.user

            const newMessages = allCasts.concat([
              {
                hash: event?.mergeMessageBody?.message?.hash,
                fid: Number(event?.mergeMessageBody?.message?.data?.fid),
                username: user?.username,
                displayName: user?.displayName,
                avatarUrl: user?.pfp?.url,
                text: message,
              },
            ])
            allCasts = newMessages
            setCasts(newMessages)
          }
        },
        error(err) {
          console.error(err)
        },
        complete() {
          console.log('Observable completed now')
        },
      })
    })
  }

  useEffect(() => {
    getStream()
  }, [])

  return (
    <div className="container mx-auto max-w-2xl my-12">
      {casts.length == 0 && <div>Waiting for first cast...</div>}
      {casts?.map((cast) => {
        return (
          <div className="mt-5 flex" key={cast.hash?.toString()}>
            <a
              href={`http://warpcast.com/${cast.username}`}
              target="_blank"
              className="flex-shrink-0"
            >
              <img
                className="h-6 w-6 mr-4 flex-shrink-0 rounded-full object-cover"
                src={cast.avatarUrl}
                alt={cast.username}
              />
            </a>
            <div>
              <a
                href={`http://warpcast.com/${cast.username}/${bytesToHexString(
                  cast?.hash as Uint8Array,
                )._unsafeUnwrap()}`}
                target="_blank"
              >
                {cast.text}
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
