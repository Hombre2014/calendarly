import Nylas from 'nylas';

export const nylas = new Nylas({
  apiUri: process.env.NYLAS_API_URI!,
  apiKey: process.env.NYLAS_API_SECRET_KEY!,
});

export const nylasConfig = {
  apiUri: process.env.NYLAS_API_URI!,
  clientId: process.env.NYLAS_CLIENT_ID!,
  apiKey: process.env.NYLAS_API_SECRET_KEY!,
  redirectUri: process.env.NEXT_PUBLIC_URL! + '/api/oauth/exchange',
};
