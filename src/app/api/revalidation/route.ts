import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET)
    return NextResponse.json({
      error: 'invalid secret token',
    });

  const tag = req.nextUrl.searchParams.get('tag');

  revalidateTag(tag as string);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
