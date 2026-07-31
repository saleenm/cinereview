import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    'Impact-Site-Verification: bf117cf3-d394-494f-a9ab-49557453c11d',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
