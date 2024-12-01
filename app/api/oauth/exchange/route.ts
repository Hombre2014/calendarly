import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

import prisma from '@/app/lib/db';
import { requireUser } from '@/app/lib/hooks';
import { nylas, nylasConfig } from '@/lib/nylas';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const session = await requireUser();
  const code = url.searchParams.get('code');

  if (!code) {
    return Response.json('No code provided', { status: 400 });
  }

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
        email,
        grantId,
      },
    });
  } catch (error) {
    console.log('Something went wrong', error);
  }

  redirect('/dashboard');
}
