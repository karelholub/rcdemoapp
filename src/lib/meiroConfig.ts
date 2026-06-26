export const meiroCollectProxyPath = '/api/meiro-collect';

export const meiroProfileApi = {
  baseUrl: 'https://riyad-capital.eu1.pipes.meiro.io',
  path: '/profile-api/mobile-app',
  proxyPath: '/api/meiro-profile',
} as const;

export const meiroIdentifierTypes = ['email', 'phone', 'crm_customer_id', 'user_id', 'mobile_user_id'] as const;

export type MeiroIdentifierType = (typeof meiroIdentifierTypes)[number];

export type MeiroEndpointType = 'mobileApp' | 'website';

export const defaultMeiroEndpointType: MeiroEndpointType = 'mobileApp';
