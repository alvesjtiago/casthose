import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { fid: string } }) {
  const user: any = await (
    await fetch(`https://api.warpcast.com/v2/user?fid=${params.fid}`, {
      cache: 'no-store',
    })
  ).json()

  return NextResponse.json(user)
}
