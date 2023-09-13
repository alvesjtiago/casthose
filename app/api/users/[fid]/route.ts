import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { fid: string } }) {
  const userResponse: any = await (
    await fetch(`https://api.warpcast.com/v2/user?fid=${params.fid}`)
  ).json()

  return NextResponse.json(userResponse)
}
