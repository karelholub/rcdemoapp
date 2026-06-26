import { meiroProfileApi, type MeiroIdentifierType } from './meiroConfig';
import type { MeiroProfile } from './types';

export type ProfileApiResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

export function getDefaultProfileIdentifier(profile: MeiroProfile): { identifierType: MeiroIdentifierType; identifierValue: string } {
  return {
    identifierType: 'mobile_user_id',
    identifierValue: profile.mobile_user_id,
  };
}

export async function fetchMeiroProfile(
  profile: MeiroProfile,
  identifier = getDefaultProfileIdentifier(profile),
): Promise<ProfileApiResult> {
  const params = new URLSearchParams({
    identifier_type: identifier.identifierType,
    identifier_value: identifier.identifierValue,
  });

  const response = await fetch(`${meiroProfileApi.proxyPath}?${params.toString()}`, {
    method: 'GET',
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
