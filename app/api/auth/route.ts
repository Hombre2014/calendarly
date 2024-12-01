import { redirect } from 'next/navigation';

import { nylas, nylasConfig } from '@/lib/nylas';

export async function GET() {
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.redirectUri,
  });

  return redirect(authUrl);
}
