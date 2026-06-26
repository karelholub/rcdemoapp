const baseUrl = 'https://riyad-capital.eu1.pipes.meiro.io';
const profilePath = '/profile-api/mobile-app';
const allowedIdentifierTypes = new Set(['email', 'phone', 'crm_customer_id', 'user_id', 'mobile_user_id']);

export default async (req: Request) => {
  if (req.method !== 'GET') {
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

  const url = new URL(req.url);
  const identifierType = url.searchParams.get('identifier_type');
  const identifierValue = url.searchParams.get('identifier_value');

  if (!identifierType || !identifierValue || !allowedIdentifierTypes.has(identifierType)) {
    return new Response(JSON.stringify({ error: 'Valid identifier_type and identifier_value are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstreamUrl = new URL(`${baseUrl}${profilePath}`);
  upstreamUrl.searchParams.set('identifier_type', identifierType);
  upstreamUrl.searchParams.set('identifier_value', identifierValue);

  const response = await fetch(upstreamUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'X-API-Key': apiKey,
    },
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
  method: ['GET'],
};
