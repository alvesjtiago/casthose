'use client'

import { useEffect, useState } from 'react'
import {
  getHubRpcClient,
  HubEventType,
  HubEvent,
  bytesToHexString,
} from '@farcaster/hub-web'

export default function Home() {
  const [casts, setCasts] = useState<Cast[]>([])

  const startStream = async () => {
    const nodeClient = getHubRpcClient(
      process.env.NEXT_PUBLIC_HUB_URL ?? '',
      {},
    )

    const result = nodeClient.subscribe({
      eventTypes: [HubEventType.MERGE_MESSAGE],
    })

    result.map((observable) => {
      observable.subscribe({
        async next(event: HubEvent) {
          const message = event?.mergeMessageBody?.message

          const hash = message?.hash
          const text = message?.data?.castAddBody?.text
          const fid = message?.data?.fid

          if (hash && text) {
            const userResponse = await (await fetch('/api/users/' + fid)).json()
            const user = userResponse?.result?.user

            const newMessage: Cast = {
              hash: hash,
              fid: Number(fid),
              username: user?.username,
              displayName: user?.displayName,
              avatarUrl: user?.pfp?.url,
              text,
            }
            setCasts((prev) => [newMessage, ...prev])
          }
        },
        error(err) {
          console.error(err)
        },
        complete() {
          console.log('Observable completed')
        },
      })
    })
  }

  useEffect(() => {
    startStream()
  }, [])

  return (
    <div className="pb-24 overflow-auto h-screen">
      <div className="container mx-auto max-w-2xl my-12 px-8">
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
                  className="h-6 w-6 mr-4 rounded-full object-cover"
                  src={cast.avatarUrl}
                  alt={cast.username}
                />
              </a>
              <div>
                <a
                  href={`http://warpcast.com/${
                    cast.username
                  }/${bytesToHexString(cast.hash).unwrapOr('')}`}
                  target="_blank"
                  className="text-ellipsis overflow-hidden whitespace-pre-line [overflow-wrap:anywhere]"
                >
                  {cast.text}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
