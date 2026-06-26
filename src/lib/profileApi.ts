import { meiroProfileApi } from './meiroConfig';
import type { MeiroProfile } from './types';

export type ProfileApiResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

export async function fetchMeiroProfile(profile: MeiroProfile): Promise<ProfileApiResult> {
  const response = await fetch(meiroProfileApi.proxyPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anonymous_id: profile.anonymous_id,
      user_id: profile.known_customer_id,
      journey_name: 'investment_account_opening',
    }),
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
