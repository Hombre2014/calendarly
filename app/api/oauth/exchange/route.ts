import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

import prisma from '@/lib/db';
import { requireUser } from '@/lib/hooks';
import { nylas, nylasConfig } from '@/lib/nylas';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const session = await requireUser();
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider') || 'google';

  if (!code) {
    return Response.json('No code provided', { status: 400 });
  }

  const scopes = {
    google: ['calendar.events'],
    microsoft: ['calendar.events', 'OnlineMeetings.ReadWrite'],
    zoom: ['calendar.events', 'meeting:write:meeting', 'user:read:user'],
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      code,
      clientId: nylasConfig.clientId,
      clientSecret: nylasConfig.apiKey,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId, email } = response;

    await prisma.user.update({
      where: { id: session.user?.id },
      data: {
        grantId: grantId,
        grantEmail: email,
        calendarProvider: provider,
        microsoftToken:
          provider === 'microsoft' ? response.accessToken : undefined,
        zoomToken: provider === 'zoom' ? response.accessToken : undefined,
      },
    });
  } catch (error) {
    console.log('Something went wrong', error);
  }

  redirect('/dashboard');
}
