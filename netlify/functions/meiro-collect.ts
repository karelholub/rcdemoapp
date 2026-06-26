const endpoints = {
  mobileApp: 'https://riyad-capital.eu1.pipes.meiro.io/collect/mobile-app',
  website: 'https://riyad-capital.eu1.pipes.meiro.io/collect/website',
} as const;

type EndpointType = keyof typeof endpoints;

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: { endpointType?: EndpointType; event?: unknown };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const endpointType = payload.endpointType ?? 'mobileApp';
  const endpoint = endpoints[endpointType];
  if (!endpoint || !payload.event) {
    return new Response(JSON.stringify({ error: 'Valid endpointType and event are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload.event),
  });

  const body = await response.text();
  return new Response(body || JSON.stringify({ ok: response.ok }), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};

export const config = {
  path: '/api/meiro-collect',
  method: ['POST'],
};
