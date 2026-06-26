const baseUrl = 'https://riyad-capital.eu1.pipes.meiro.io';
const profilePath = '/profile-api/mobile-app';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Netlify.env.get('MEIRO_PROFILE_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'MEIRO_PROFILE_API_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestBody = await req.text();
  const response = await fetch(`${baseUrl}${profilePath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-API-Key': apiKey,
    },
    body: requestBody,
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};

export const config = {
  path: '/api/meiro-profile',
  method: ['POST'],
};
