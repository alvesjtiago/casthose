// export const runtime = "edge";
// export const dynamic = "force-dynamic";

import { getSSLHubRpcClient, HubEventType } from "@farcaster/hub-nodejs";

export async function POST(request: Request) {
  const nodeClient = getSSLHubRpcClient(process.env.HUB || "");

  const result = await nodeClient.subscribe({
    eventTypes: [HubEventType.MERGE_MESSAGE],
  });

  const stream = result._unsafeUnwrap();

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        controller.enqueue(
          encoder.encode(
            event?.mergeMessageBody?.message?.data?.castAddBody?.text
          )
        );
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
