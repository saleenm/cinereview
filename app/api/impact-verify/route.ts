import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    'Impact-Site-Verification: 466a603c-1806-4511-85ab-4de775dc301d',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
